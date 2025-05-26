import React, { useState, useRef, ReactNode } from "react";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	LayoutChangeEvent,
	StyleProp,
	ViewStyle,
	TextStyle,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
	ReduceMotion,
} from "react-native-reanimated";
import Typography from "./Typography";
import { useAppColors } from "@/hooks/useAppColors";

export type TabItem = {
	id: string;
	title: string;
	icon?: React.ReactElement;
	content: React.ReactNode;
};

export type AnimatedTabsProps = {
	tabs: TabItem[];
	containerStyle?: StyleProp<ViewStyle>;
	headerContainerStyle?: StyleProp<ViewStyle>;
	tabStyle?: StyleProp<ViewStyle>;
	tabTextStyle?: StyleProp<TextStyle>;
	activeTabTextStyle?: StyleProp<TextStyle>;
	indicatorStyle?: StyleProp<ViewStyle>;
	reduceMotion?: "always" | "never" | "system";
};

// Animation Configuration
const INDICATOR_ANIM_DURATION = 250;
const INDICATOR_HEIGHT = 3;

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
	tabs,
	containerStyle,
	headerContainerStyle,
	tabStyle,
	tabTextStyle,
	activeTabTextStyle,
	indicatorStyle,
	reduceMotion = "system",
}) => {
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);
	const layoutRef = useRef<Array<{ x: number; width: number }>>([]);
	const colors = useAppColors();

	// Shared values for indicator position and width
	const indicatorX = useSharedValue(0);
	const indicatorWidth = useSharedValue(0);
	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const handleTabPress = (index: number) => {
		if (layoutRef.current[index]) {
			const { x, width } = layoutRef.current[index];
			// Animate indicator position and width
			indicatorX.value = withTiming(x, {
				duration: INDICATOR_ANIM_DURATION,
				easing: Easing.out(Easing.quad),
				reduceMotion: motion,
			});
			indicatorWidth.value = withTiming(width, {
				duration: INDICATOR_ANIM_DURATION,
				easing: Easing.out(Easing.quad),
				reduceMotion: motion,
			});
			setSelectedTabIndex(index);
		}
	};

	const handleTabLayout = (event: LayoutChangeEvent, index: number) => {
		const { x, width } = event.nativeEvent.layout;
		layoutRef.current[index] = { x, width };

		// Initialize indicator position on first layout of the initial tab
		if (index === selectedTabIndex && indicatorWidth.value === 0) {
			indicatorX.value = x;
			indicatorWidth.value = width;
		}
	};

	// Animated style for the indicator bar
	const indicatorAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: indicatorWidth.value,
			transform: [{ translateX: indicatorX.value }],
		};
	});

	// Render the current tab's content
	const CurrentContent = tabs[selectedTabIndex]?.content ?? null;

	return (
		<View style={[styles.container, containerStyle]}>
			<View style={[styles.headerContainer, headerContainerStyle, {borderBottomColor: colors.Neutral100}]}>
				{tabs.map((tab, index) => (
					<TouchableOpacity
						key={tab.id}
						style={[styles.tab, tabStyle]}
						onPress={() => handleTabPress(index)}
						onLayout={(event) => handleTabLayout(event, index)}
						activeOpacity={0.8}
					>
						{tab.icon && <View style={styles.iconContainer}>{tab.icon}</View>}
						<Typography
							size="sm"
							weight="regular"
							style={[
								{ color: colors.Neutral500 },
								tabTextStyle,
								selectedTabIndex === index && { color: colors.Neutral900 },
								selectedTabIndex === index && activeTabTextStyle,
							]}
							numberOfLines={1}
						>
							{tab.title}
						</Typography>
					</TouchableOpacity>
				))}
				{/* Animated Indicator */}
				<Animated.View
					style={[
						styles.indicator,
						indicatorStyle,
						indicatorAnimatedStyle,
						{ backgroundColor: colors.PrimaryNormal },
					]}
				/>
				{/* Optional static bottom border */}
				<View style={[styles.headerBorder, {borderBottomColor: colors.Neutral100}]} />
			</View>

			{/* Content Area */}
			<View style={styles.contentContainer}>{CurrentContent}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1, // Adjust as needed, maybe height should be auto
	},
	headerContainer: {
		flexDirection: "row",
		position: "relative", // For absolute positioning of indicator and border
		borderBottomWidth: StyleSheet.hairlineWidth,
		// borderBottomColor: "#555",
	},
	tab: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 16, // Adjust spacing between tabs
		// flex: 1, // Uncomment if tabs should equally share width
	},
	iconContainer: {
		marginRight: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicator: {
		position: "absolute",
		bottom: 0, // Position at the bottom of the header
		left: 0,
		height: INDICATOR_HEIGHT,
		// backgroundColor: INDICATOR_COLOR,
		borderRadius: INDICATOR_HEIGHT / 2,
	},
	headerBorder: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: StyleSheet.hairlineWidth,
		zIndex: -1, // Ensure it's behind the indicator
	},
	contentContainer: {
		flex: 1,
		padding: 16,
	},
});

export default AnimatedTabs;
