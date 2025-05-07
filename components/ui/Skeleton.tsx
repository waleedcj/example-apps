import React, { ReactNode, useEffect } from "react";
import {
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
	LayoutChangeEvent,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	interpolate,
	cancelAnimation,
	Easing,
	ReduceMotion,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAppColors } from "@/hooks/useAppColors";

type SkeletonProps = {
	isLoading: boolean;
	children: ReactNode;
	style: StyleProp<ViewStyle>;
	duration?: number;
	delay?: number;
    reduceMotion?: "always" | "never" | "system";
}

const GRADIENT_WIDTH_PERCENTAGE = 1; //how wide you want the gradient to be

const Skeleton: React.FC<SkeletonProps> = ({
	isLoading,
	children,
	style,
	duration = 1000,
    reduceMotion = 'system'
}) => {
	const colors = useAppColors();
	const sharedValue = useSharedValue(0);
	const componentWidth = useSharedValue(0);
	const baseColor = colors.Neutral50;
	const shimmerColor = colors.Neutral70;

    const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	useEffect(() => {
		if (isLoading) {
			// const effectiveDuration =
			// 	duration ??
			// 	Math.max(1000, componentWidth.value * ANIMATION_SPEED_FACTOR);

			sharedValue.value = 0; // Reset before starting
			sharedValue.value = withRepeat(
				withTiming(1, {
					duration: duration,
					easing: Easing.linear,
					reduceMotion: motion,
				}),
				-1,
				false,
				() => {},
				motion
			);
		} else {
			// Cancel animation if not loading
			cancelAnimation(sharedValue);
			sharedValue.value = 0;
		}

		// Cleanup
		return () => cancelAnimation(sharedValue);
	}, [isLoading, sharedValue]);

	const animatedStyle = useAnimatedStyle(() => {
		const gradientWidth = componentWidth.value * GRADIENT_WIDTH_PERCENTAGE;
		const translateX = interpolate(
			sharedValue.value,
			[0, 1],
			[-gradientWidth, componentWidth.value]
		);

		// Control opacity based on measurement *within the animated style*
		const opacity = componentWidth.value > 0 ? 1 : 0;

		return {
			opacity: opacity,
			transform: [{ translateX }],
			width: gradientWidth,
		};
	});

	//calculate the view layout
	const handleLayout = (event: LayoutChangeEvent) => {
		const width = event.nativeEvent.layout.width;
		componentWidth.value = width;
	};

	return isLoading ? (
		<View
			style={[styles.container, { backgroundColor: baseColor }, style]}
			onLayout={handleLayout} // Measure the width
		>
			<Animated.View
				style={[
					StyleSheet.absoluteFill,
					styles.gradientContainer,
					animatedStyle,
				]}
			>
				<LinearGradient
					colors={[baseColor, shimmerColor, baseColor]}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={styles.gradient}
				/>
			</Animated.View>
		</View>
	) : (
		<>{children}</>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		position: "relative",
	},
	gradientContainer: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
	},
	gradient: {
		flex: 1,
	},
});

export default Skeleton;
