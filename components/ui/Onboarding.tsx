import React, { useRef, useState } from "react";
import {
	StyleSheet,
	FlatList,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
} from "react-native";
// import LottieView from "lottie-react-native";
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useAppColors } from "@/hooks/useAppColors";
import ScrollingPaginationDots from "./PaginationDots";

const { width, height } = Dimensions.get("window");

// Define the structure of a single onboarding item
export type OnboardingDataItem = {
	id: string;
	title: string;
	description: string;
	lottieAnim: string;
};

// Define the props for the reusable component
type OnboardingProps = {
	data: OnboardingDataItem[];
	onComplete: () => void;
};

const Onboarding: React.FC<OnboardingProps> = ({ data, onComplete }) => {
	const flatListRef = useRef<FlatList<OnboardingDataItem>>(null);
	const scrollX = useSharedValue(0);
	const [currentIndex, setCurrentIndex] = useState(0);
	const colors = useAppColors();

	// Update current index based on viewable items
	const viewableItemsChanged = useRef(
		({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
			if (viewableItems.length > 0 && viewableItems[0].index !== null) {
				setCurrentIndex(viewableItems[0].index);
			}
		}
	).current;

	const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

	// Reanimated scroll handler
	const scrollHandler = useAnimatedScrollHandler((event) => {
		scrollX.value = event.contentOffset.x;
	});

	// Handle "Next" or "Get Started" button press
	const onNextPress = () => {
		if (currentIndex < data.length - 1) {
			flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
		} else {
			onComplete();
		}
	};

	const renderItem = ({ item }: { item: OnboardingDataItem }) => {
		const lottieStyle = {
			width: width * (item.id === "3" ? 0.5 : 0.8),
			height: height * 0.4,
			marginBottom: 30,
		};
		return (
			<View style={[styles.slide, { width }]}>
				{/* <LottieView
					source={item.lottieAnim}
					autoPlay
					loop
					style={lottieStyle}
				/> */}
				<Text style={[styles.title, { color: colors.Neutral900 }]}>
					{item.title}
				</Text>
				<Text style={[styles.description, { color: colors.Neutral700 }]}>
					{item.description}
				</Text>
			</View>
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.bgColor }]}>
			<Animated.FlatList
				ref={flatListRef}
				data={data}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				bounces={false}
				onScroll={scrollHandler}
				scrollEventThrottle={16} // Standard throttle for reanimated
				onViewableItemsChanged={viewableItemsChanged}
				viewabilityConfig={viewConfig}
			/>

			{/* Pagination Dots */}
			<View style={styles.paginationContainer}>
				<ScrollingPaginationDots
					scrollX={scrollX}
					count={data.length}
					slideWidth={width}
					dotColor={colors.PrimaryNormal}
					inactiveDotColor={colors.Neutral300}
					dotSize={10}
					spacing={12}
					inactiveDotOpacity={0.3}
					maxVisibleDots={5}
				/>
			</View>

			{/* Next Button */}
			<TouchableOpacity
				style={[styles.nextButton, { backgroundColor: colors.PrimaryNormal }]}
				onPress={onNextPress}
				activeOpacity={0.8}
			>
				<Text style={[styles.nextButtonText, { color: colors.Neutral0 }]}>
					{currentIndex === data.length - 1 ? "Get Started" : "Next"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	slide: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 16,
		lineHeight: 32,
	},
	description: {
		fontSize: 16,
		fontWeight: "400",
		textAlign: "center",
		lineHeight: 24,
		paddingHorizontal: 10,
		marginBottom: 64,
	},
	paginationContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	paginationDot: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginHorizontal: 8,
	},
	nextButton: {
		alignSelf: "center",
		paddingVertical: 15,
		paddingHorizontal: 40,
		borderRadius: 30,
		minWidth: width * 0.5,
		alignItems: "center",
	},
	nextButtonText: {
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default Onboarding;
