import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, HEADER_HEIGHT } from "./Header";
import { useAppColors } from "@/hooks/useAppColors";

const defaultData = Array.from({ length: 100 }, (_, i) => ({ id: `item-${i}` }));
const { width } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = width / NUM_COLUMNS - (ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function AnimatedHeaderDemo() {
	const scrollY = useSharedValue(0);
	const lastScrollY = useSharedValue(0);
	const headerShown = useSharedValue(1);
	const colors = useAppColors();

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

	const renderItem = ({ item }: { item: { id: string } }) => {
		return (
			<View key={item.id} style={[styles.cardItem, { backgroundColor: colors.Neutral50 }]}>
				{/* Skeleton Placeholders */}
				<View style={[styles.skeletonImage, { backgroundColor: colors.Neutral90 }]} />
				<View style={[styles.skeletonLine, { width: "100%", backgroundColor: colors.Neutral90 }]} />
				<View style={[styles.skeletonLine, { width: "80%", backgroundColor: colors.Neutral90 }]} />
				<View style={[styles.skeletonLine, { width: "60%", backgroundColor: colors.Neutral90 }]} />
			</View>
		);
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.Neutral0 }]}>
			<Header headerShown={headerShown} />
			<View style={styles.scrollView}>
				<Animated.FlatList
					contentContainerStyle={{
						paddingTop: HEADER_HEIGHT + ITEM_MARGIN,
						paddingHorizontal: ITEM_MARGIN / 2,
					}}
					numColumns={NUM_COLUMNS}
					data={defaultData}
					showsVerticalScrollIndicator={false}
					onScroll={scrollHandler}
					renderItem={renderItem}
					scrollEventThrottle={16}
				/>
			</View>
		</SafeAreaView>
	);
}

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardItem: {
		width: ITEM_WIDTH,
		margin: ITEM_MARGIN / 2,
		borderRadius: 8,
		padding: 12,
	},
	skeletonImage: {
		width: "100%",
		height: ITEM_WIDTH * 0.6,
		borderRadius: 6,
		marginBottom: 10,
	},
	skeletonLine: {
		height: 12,
		borderRadius: 4,
		marginBottom: 8,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	item: {
		padding: 20,
		borderBottomWidth: 1,
	},
	text: {
		fontSize: 16,
		fontWeight: "400",
	},
});
