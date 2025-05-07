// components/ReusableOnboarding.tsx

import React, { useRef, useState } from "react";
import {
	StyleSheet,
	FlatList,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";
import { useAppColors } from "@/hooks/useAppColors"; // Adjust import path
// import ScrollPaginationDots from "./PaginationDots";
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
		// console.log(event.contentOffset.x);
		scrollX.value = event.contentOffset.x;
	});

	// Handle "Next" or "Get Started" button press
	const onNextPress = () => {
		if (currentIndex < data.length - 1) {
			flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
		} else {
			onComplete(); // Call the completion callback
		}
	};

	// Render a single slide
	const renderItem = ({ item }: { item: OnboardingDataItem }) => {
		// Dynamic Lottie style based on item ID (example logic from original code)
		const lottieStyle = {
			width: width * (item.id === "3" ? 0.5 : 0.8), // Adjust multiplier as needed
			height: height * 0.4, // Adjusted height
			marginBottom: 30,
		};
		return (
			<View style={[styles.slide, { width }]}>
				<LottieView
					source={item.lottieAnim}
					autoPlay
					loop
					style={lottieStyle}
				/>
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
					slideWidth={width} // Important: width of each item in your FlatList
					dotColor={colors.PrimaryNormal} // Example: your primary color for active state
					inactiveDotColor={colors.Neutral300} // Example: a muted color for inactive states
					dotSize={10}
					spacing={12}
					activeDotScale={1.5} // Active dot will be 50% larger
					inactiveDotOpacity={0.3} // Dots at the edge of the visible window will be 30% opaque
					maxVisibleDots={5} // Display a window of 5 dots (e.g., ● ● O ● ●)
					// containerStyle={{ backgroundColor: 'lightgrey' }} // Optional: for debugging layout
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
		// width is set dynamically
		alignItems: "center",
		justifyContent: "center", // Center content vertically
		paddingHorizontal: 20, // Use horizontal padding
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 16,
		lineHeight: 32, // Adjusted line height
	},
	description: {
		fontSize: 16, // Standard base size
		fontWeight: "400",
		textAlign: "center",
		lineHeight: 24, // Adjusted line height
		paddingHorizontal: 10, // Add some horizontal padding for description
		marginBottom: 64,
	},
	paginationContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center", // Center dots horizontally
		alignItems: "center",
	},
	paginationDot: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginHorizontal: 8,
	},
	nextButton: {
		alignSelf: "center", // Center the button
		paddingVertical: 15,
		paddingHorizontal: 40, // Make button wider
		borderRadius: 30,
		minWidth: width * 0.5, // Ensure minimum width
		alignItems: "center", // Center text inside button
	},
	nextButtonText: {
		fontSize: 16, // Standard base size
		fontWeight: "bold", // Make text bold
	},
});

export default Onboarding;

// ----- Hooks and Data (Keep these separate or in appropriate folders) -----

// hooks/useAppColors.ts
// import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors'; // Adjust path

// export function useAppColors() {
//   const scheme = useColorScheme() ?? 'light'; // Default to light
//   return scheme === 'dark' ? Colors.dark : Colors.light;
// }

// data/OnboardingData.ts (Example Data Structure)
// export const OnboardingData: OnboardingDataItem[] = [
//     {
//         id: '1',
//         title: 'Find Your Spare Parts, Fast',
//         description: 'Browse a vast catalog of auto spare parts...',
//         lottieAnim: require('@/assets/onboarding-json/onboarding1.json')
//     },
//     {
//         id: '2',
//         title: 'Submit Requests Instantly',
//         description: 'Submit a request for the parts you need...',
//         lottieAnim: require('@/assets/onboarding-json/onboarding2.json')
//     },
//     {
//         id: '3',
//         title: 'Chat with Sellers, Directly',
//         description: 'Once your request is accepted, you can chat...',
//         lottieAnim: require('@/assets/onboarding-json/onboarding3.json')
//     },
// ]

// constants/Colors.ts
// export const Colors = { /* Your light/dark color objects */ };
