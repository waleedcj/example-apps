import React, { useEffect } from "react";
import {
	View,
	TouchableOpacity,
	Text,
	FlatList,
	StyleSheet,
	StyleProp,
	ViewStyle,
	TextStyle,
	ListRenderItem,
	useWindowDimensions,
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

const INPUT_HEIGHT = 60;

export type DropdownPickerItem = {
	id: string | number;
	label: string;
	value: any;
	[key: string]: any;
}

type DropdownPickerProps<TItem extends DropdownPickerItem> = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	data: TItem[];
	onItemSelected: (item: TItem) => void;
    inputHeight?: number;
	renderItem?: ListRenderItem<TItem>;
	placeholder?: string;
	selectedValue?: TItem | null;
	triggerContainerStyle?: StyleProp<ViewStyle>;
	triggerTextStyle?: StyleProp<TextStyle>;
	triggerIcon?: React.ReactElement;
	dropdownBackgroundColor?: string;
	dropdownMaxHeight?: number; // User-defined max height for the list itself
	dropdownItemTextStyle?: StyleProp<TextStyle>;
	dropdownSeparatorColor?: string;
	animationDuration?: number;
	reduceMotion?: "never" | "always" | "system";
	containerStyle?: StyleProp<ViewStyle>; // Overall container style
	itemHeight?: number; // Optional: if you know the exact height of each item
};

const DropdownPicker = <TItem extends DropdownPickerItem>({
	data,
	onItemSelected,
    isOpen,
    setIsOpen,
	renderItem,
	placeholder = "Select an item...",
	selectedValue,
	triggerContainerStyle,
	triggerTextStyle,
	triggerIcon,
	dropdownBackgroundColor = "#FFFFFF",
	dropdownMaxHeight,
	dropdownItemTextStyle,
	dropdownSeparatorColor = "#E0E0E0",
	animationDuration = 300,
	reduceMotion = "system",
	containerStyle,
	itemHeight = 45, // Default estimated item height
}: DropdownPickerProps<TItem>) => {
	// const [isOpen, setIsOpen] = useState(false);
	const animationProgress = useSharedValue(0);
	const { height: windowHeight, width: windowWidth } = useWindowDimensions();
	// Calculate default max height for the dropdown list part
	const defaultListMaxHeight = dropdownMaxHeight || windowHeight * 0.4;
    // Calculate the actual height the list content would take
	const listContentActualHeight = data.length * itemHeight;
    //take the min height this is useful for when the list is small
	const listVisibleHeight = Math.min(defaultListMaxHeight, listContentActualHeight);

	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const TIMING_CONFIG = {
		duration: animationDuration,
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		reduceMotion: motion,
	};

    useEffect(() => {
        if (isOpen) {
            // Parent wants to open it
            animationProgress.value = withTiming(1, TIMING_CONFIG);
        } else {
            // Parent wants to close it
            animationProgress.value = withTiming(0, TIMING_CONFIG);
        }
    }, [isOpen, animationProgress, TIMING_CONFIG]); 

	const toggleDropdown = () => {
        setIsOpen(!isOpen); 
	};

	const handleItemPress = (item: TItem) => {
		onItemSelected(item);
	};

	const animatedOuterContainerStyle = useAnimatedStyle(() => {
		// The outer container's height animates from INPUT_HEIGHT to INPUT_HEIGHT + listVisibleHeight
		const height = interpolate(
			animationProgress.value,
			[0, 1],
			[INPUT_HEIGHT, INPUT_HEIGHT + (data.length > 0 ? listVisibleHeight : 0)], // No extra height if no data
			Extrapolation.CLAMP
		);
		return { height };
	});

	const animatedDropdownContentStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			animationProgress.value,
			[0, 0.5, 1], // Start fading in a bit later
			[0, 0, 1],
			Extrapolation.CLAMP
		);
		const translateY = interpolate(
			animationProgress.value,
			[0, 1],
			[-20, 0], // Slide down effect
			Extrapolation.CLAMP
		);
		return { opacity, transform: [{ translateY }] };
	});

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(animationProgress.value, [0, 1], [0, 180])}deg` }],
        }
    })

	const defaultRenderItem: ListRenderItem<TItem> = ({ item }) => (
		<TouchableOpacity style={styles.defaultItemContainer} onPress={() => handleItemPress(item)}>
			<Text style={[styles.defaultItemText, dropdownItemTextStyle]}>{item.label}</Text>
		</TouchableOpacity>
	);

	return (
		<Animated.View
			style={[
				styles.outerContainer,
				{ width: windowWidth - 32, backgroundColor: dropdownBackgroundColor }, // Background here for the whole area
				containerStyle,
				animatedOuterContainerStyle, // Height animation here
			]}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={toggleDropdown}
				style={[styles.triggerArea, { height: INPUT_HEIGHT }, triggerContainerStyle]}
			>
				<Text style={[styles.triggerText, triggerTextStyle]} numberOfLines={1}>
					{selectedValue ? selectedValue.label : placeholder}
				</Text>
				<Animated.View style={animatedIconStyle}>
					{triggerIcon}
				</Animated.View>
			</TouchableOpacity>

			{/* The list part, only rendered when isOpen for performance, animated for visual effect */}
			{isOpen && data.length > 0 && (
				<Animated.View style={[styles.listWrapper, animatedDropdownContentStyle]}>
                    {/* you can replace FlatList with flashlist or legendlist just import and use */}
					<FlatList
						data={data}
						renderItem={renderItem || defaultRenderItem}
						keyExtractor={(item) => String(item.id)}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						ItemSeparatorComponent={
							dropdownSeparatorColor
								? () => <View style={[styles.separator, { backgroundColor: dropdownSeparatorColor }]} />
								: () => <></>
						}
						style={{ maxHeight: listVisibleHeight }} // Ensure FlatList doesn't exceed calculated visible height
                        ListEmptyComponent={() => (
                            <View style={[styles.emptyListContainer, animatedDropdownContentStyle]}>
                                <Text style={styles.emptyListText}>No items available</Text>
                            </View>
                        )}
					/>
				</Animated.View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		borderRadius: 8,
		marginHorizontal: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
		zIndex: 1,
	},
	triggerArea: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 12,
		zIndex: 2,
	},
	triggerText: {
		flex: 1,
		fontSize: 16,
		color: "#333",
		marginRight: 8,
	},
	listWrapper: {
		flex: 1,
		marginTop: INPUT_HEIGHT,
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	emptyListContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	emptyListText: {
		color: "#888",
		fontSize: 14,
	},
	defaultItemContainer: {
		paddingVertical: 12,
		paddingHorizontal: 15,
	},
	defaultItemText: {
		fontSize: 16,
		color: "#333",
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		marginHorizontal: 16,
	},
});

export default DropdownPicker;
