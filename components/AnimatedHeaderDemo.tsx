import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler,
	withSpring,
} from "react-native-reanimated";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Header, HEADER_HEIGHT } from "./Header";
import { useTheme } from "@react-navigation/native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import LoadingSpinnerSVG from "./ui/LoadingSpinner";

// Default data to scroll through
const defaultData = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

// Main Component with ScrollView and Animated Header
export default function AnimatedHeaderDemo() {
	const scrollY = useSharedValue(0);
	const lastScrollY = useSharedValue(0);
	const headerShown = useSharedValue(1);
	const { colors } = useTheme();
	const AnimatedFlashList =
		Animated.createAnimatedComponent<FlashListProps<any>>(FlashList);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			const currentScrollY = event.contentOffset.y;

			// Only process scroll if we're not in the bounce area (y >= 0)
			if (currentScrollY >= 0) {
				const dy = currentScrollY - lastScrollY.value;

				// Detect if we're actively scrolling or if it's bounce movement
				if (Math.abs(dy) > 0.5) {
					// Using a smaller divisor for more responsive movement
					const newValue = headerShown.value + -dy / 50;

					// Clamp the value with better boundary handling
					headerShown.value = withSpring(Math.min(Math.max(newValue, 0), 1), {
						damping: 15,
						stiffness: 200,
					});
				}
			}

			lastScrollY.value = currentScrollY;
			scrollY.value = currentScrollY;
		},
	});

	const renderItem = ({ item }: { item: string }) => (
		<View style={styles.item}>
			<Text style={[styles.text, { color: colors.Neutral700 }]}>{item}</Text>
		</View>
	);

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.Neutral50 }]}
		>
			<Header headerShown={headerShown} />
			<View style={styles.scrollView}>
				<AnimatedFlashList
					contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
					data={defaultData}
					showsVerticalScrollIndicator={false}
					onScroll={scrollHandler}
					estimatedItemSize={50}
					renderItem={renderItem}
					// bounces={false}
					scrollEventThrottle={16}
				/>
			</View>

			{/* <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        // bounces={false}
        scrollEventThrottle={16}
      >
        {defaultData.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={[styles.text, { color: colors.Neutral700 }]}>
              {item}
            </Text>
          </View>
        ))}
      </Animated.ScrollView> */}
		</SafeAreaView>
	);
}

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
		shadowRadius: 3,
		elevation: 4,
	},
	title: {
		color: "black",
		fontWeight: "bold",
	},
	scrollView: {
		flex: 1,
		// paddingTop: 50,
	},
	contentContainer: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	item: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
  
	},
	text: {
		fontSize: 16,
		fontWeight: "400",
	},
});
