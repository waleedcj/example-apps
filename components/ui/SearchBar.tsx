import React, { useState, useEffect, useRef } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Text,
	FlatList,
	Keyboard,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
	interpolate,
	Extrapolation,
	ReduceMotion,
} from "react-native-reanimated";
import { useRecentSearchesStore } from "@/store/useRecentSearchStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchResultsQuery } from "@/hooks/useGetSearchResults";
import { SearchResult } from "@/api/MockApi";

const INPUT_HEIGHT = 50;
const PADDING_VERTICAL = 0; // Padding within the expanded container for recent searches
const HISTORY_HEIGHT = Dimensions.get("window").height * 0.3;
const MIN_QUERY_LENGTH = 1;
const DEBOUNCE_DELAY = 300;

type AnimatedSearchBarProps = {
	onSearchSubmit: (term: string) => void;
	placeholder?: string;
	searchStartIcon: React.ReactNode;
	recentSearchStartIcon?: React.ReactNode;
	recentSearchEndIcon?: React.ReactNode;
	loaderColor?: string;
	inputTextColor?: string;
	containerBackgroundColor?: string;
	recentSearchTextColor?: string;
	recentSearchesTitleColor?: string;
	reduceMotion?: "never" | "always" | "system";
};

const SearchBar: React.FC<AnimatedSearchBarProps> = ({
	onSearchSubmit,
	reduceMotion = "system",
	placeholder = "Search...",
	loaderColor = "#888",
	recentSearchStartIcon,
	recentSearchEndIcon,
	inputTextColor = "#333",
	containerBackgroundColor = "#FFFFFF",
	recentSearchTextColor = "#555",
	recentSearchesTitleColor = "#333",
	searchStartIcon,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const { recentSearches, addRecentSearch, removeRecentSearch, isLoaded } = useRecentSearchesStore();
	const animationProgress = useSharedValue(0); // 0: closed, 1: open
	const inputRef = useRef<TextInput>(null);
	const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
	const { searchResults, isLoadingSearchResults, isErrorSearchResults, searchError } = useSearchResultsQuery({
		searchTerm: debouncedSearchTerm,
		minQueryLength: MIN_QUERY_LENGTH,
		isSearchEnabled: isFocused, // Pass the focus state
	});

	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const TIMING_CONFIG = {
		duration: 350,
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		reduceMotion: motion,
	};

	useEffect(() => {
		// Load searches if not already loaded (e.g., if app was closed and reopened)
		if (!isLoaded) {
			useRecentSearchesStore.getState().loadRecentSearches();
		}
	}, [isLoaded]);

	//handle functions
	const handleFocus = () => {
		setIsFocused(true);
		animationProgress.value = withTiming(1, TIMING_CONFIG);
	};

	const handleBlur = () => {
		// Delay blur action to allow tap on recent search item
		setTimeout(() => {
			if (!inputRef.current?.isFocused()) {
				// Check if still focused (e.g., by tapping an item)
				setIsFocused(false);
				animationProgress.value = withTiming(0, TIMING_CONFIG);
			}
		}, 100);
	};

	const handleSubmit = () => {
		if (searchTerm.trim()) {
			onSearchSubmit(searchTerm.trim());
			addRecentSearch(searchTerm.trim());
			setSearchTerm(""); // Optionally clear input after search
			Keyboard.dismiss();
			inputRef.current?.blur(); // This will trigger handleBlur
		}
	};

	const handleRecentSearchPress = (term: string) => {
		setSearchTerm(term);
		onSearchSubmit(term);
		// No need to addRecentSearch here as it's already recent
		Keyboard.dismiss();
		inputRef.current?.blur();
	};

	const handleSearchPress = (term: string) => {
		addRecentSearch(term.trim());
		onSearchSubmit(term);
		setSearchTerm("");
		// No need to addRecentSearch here as it's already recent
		Keyboard.dismiss();
		inputRef.current?.blur();
	};

	//animations
	const animatedContainerStyle = useAnimatedStyle(() => {
		const height = interpolate(
			animationProgress.value,
			[0, 1],
			[INPUT_HEIGHT, HISTORY_HEIGHT + PADDING_VERTICAL],
			Extrapolation.CLAMP
		);
		return {
			height,
		};
	});

	const animatedRecentSearchesStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			animationProgress.value,
			[0, 0.5, 1],
			[0, 0, 1], // Fade in after container starts expanding
			Extrapolation.CLAMP
		);
		const translateY = interpolate(
			animationProgress.value,
			[0, 1],
			[-20, 0], // Slight upward movement as it fades in
			Extrapolation.CLAMP
		);
		return {
			opacity,
			transform: [{ translateY }],
		};
	});

	//flatlist renders
	const renderRecentSearchItem = ({ item }: { item: string }) => (
		<TouchableOpacity style={styles.recentItem} onPress={() => handleRecentSearchPress(item)}>
			{recentSearchStartIcon}
			<Text style={[styles.recentItemText, { color: recentSearchTextColor }]}>{item}</Text>
			<TouchableOpacity onPress={() => removeRecentSearch(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
				{recentSearchEndIcon}
			</TouchableOpacity>
		</TouchableOpacity>
	);

	const renderSearchResultItem = ({ item }: { item: SearchResult }) => (
		<TouchableOpacity style={styles.recentItem} onPress={() => handleSearchPress(item.title)}>
			<Text style={[styles.recentItemText, { color: recentSearchTextColor }]}>{item.title}</Text>
		</TouchableOpacity>
	);

	//conditions for the lists
	const showRecentSearches = isFocused && debouncedSearchTerm.length < MIN_QUERY_LENGTH;
	const showSearchResults = isFocused && debouncedSearchTerm.length >= MIN_QUERY_LENGTH;

	return (
		<Animated.View
			style={[
				styles.outerContainer,
				{
					backgroundColor: containerBackgroundColor,
					width: Dimensions.get("window").width - 32, //100% - left margin 16 - right margin 16
				},
				animatedContainerStyle,
			]}
		>
			<View style={styles.inputRow}>
				{searchStartIcon}
				<TextInput
					ref={inputRef}
					style={[styles.input, { color: inputTextColor }]}
					placeholder={placeholder}
					placeholderTextColor="#A0A0A0"
					value={searchTerm}
					onChangeText={setSearchTerm}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onSubmitEditing={handleSubmit}
					returnKeyType="search"
				/>
			</View>

			{isFocused && (
				<Animated.View style={[styles.recentSearchesWrapper, animatedRecentSearchesStyle]}>
					{showRecentSearches && (
						<View style={styles.searchResultsListContainer}>
							{recentSearches.length > 0 ? (
								<>
									<Text style={[styles.recentSearchesTitle, { color: recentSearchesTitleColor }]}>Recent Searches</Text>
									<FlatList
										data={recentSearches}
										renderItem={renderRecentSearchItem}
										contentContainerStyle={{ paddingBottom: 32 }} // Increased bottom padding
										keyExtractor={(item, index) => `${item}-${index}`}
										showsVerticalScrollIndicator={false}
										keyboardShouldPersistTaps="handled" // Important for TouchableOpacity inside FlatList
									/>
								</>
							) : (
								recentSearches.length === 0 && <Text style={styles.noResultsText}>No recent searches</Text>
							)}
						</View>
					)}
					{/* normally it is good practice to load first not load finish check error if no error then display the content */}
					{showSearchResults && (
						<View style={styles.searchResultsListContainer}>
							{isLoadingSearchResults ? (
								<ActivityIndicator size="small" color={loaderColor} style={{ marginTop: 20 }} />
							) : isErrorSearchResults ? (
								<Text style={styles.errorText}>Error: {searchError?.message || "Could not fetch results"}</Text>
							) : searchResults && searchResults?.length > 0 ? (
								<FlatList
									data={searchResults}
									renderItem={renderSearchResultItem}
									keyExtractor={(item) => `result-${item.id}`}
									keyboardShouldPersistTaps="handled"
									showsVerticalScrollIndicator={false}
								/>
							) : (
								searchResults &&
								recentSearches.length === 0 && (
									<Text style={styles.noResultsText}>No results found for "{debouncedSearchTerm}"</Text>
								)
							)}
						</View>
					)}
				</Animated.View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		borderRadius: 12,
		marginHorizontal: 16,
		overflow: "hidden",
		// Shadow (iOS)
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		// Shadow (Android)
		elevation: 5,
		// position: "absolute",
		zIndex: 1,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		height: INPUT_HEIGHT,
		paddingHorizontal: 12,
	},
	searchResultsListContainer: {
		flex: 1,
	},
	errorText: {
		textAlign: "center",
		marginTop: 20,
		color: "#ff3333",
	},
	noResultsText: {
		textAlign: "center",
		marginTop: 20,
		color: "#888",
	},
	input: {
		flex: 1,
		fontSize: 16,
		height: "100%",
	},
	recentSearchesWrapper: {
		flex: 1, // Take available space within the animated outer container
		paddingHorizontal: 15,
		paddingBottom: PADDING_VERTICAL, // Space at the bottom
	},
	recentSearchesTitle: {
		fontSize: 14,
		fontWeight: "600",
		marginTop: 10,
		marginBottom: 8,
	},
	recentItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
	recentItemText: {
		flex: 1,
		fontSize: 15,
	},
});

export default SearchBar;
