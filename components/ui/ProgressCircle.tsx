// ProgressCircle.tsx
import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedProps,
	Easing,
	ReduceMotion, // For more animation control if needed
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const DEFAULT_SIZE = 100;
const DEFAULT_STROKE_WIDTH = 8; // Made slightly thicker for better visibility

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressCircleProps = {
	progress: number; // Value between 0 and 1
	progressColor: string;
	trackColor: string;
	size?: number;
	strokeWidth?: number;
	animationDuration?: number;
	children?: React.ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
	reduceMotion?: "never" | "always" | "system";
};

export default function ProgressCircle({
	progress,
	progressColor,
	trackColor,
	size = DEFAULT_SIZE,
	strokeWidth = DEFAULT_STROKE_WIDTH,
	animationDuration = 1000, // Default animation duration
	children,
	containerStyle,
	reduceMotion = "system",
}: ProgressCircleProps) {
	// Recalculate radius and circumference based on current size and strokeWidth
	const actualRadius = (size - strokeWidth) / 2;
	const actualCircumference = 2 * Math.PI * actualRadius;

	const progressValue = useSharedValue(0);
	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	useEffect(() => {
		// Ensure progress is clamped between 0 and 1
		const clampedProgress = Math.max(0, Math.min(1, progress));
		progressValue.value = withTiming(clampedProgress, {
			duration: animationDuration,
			easing: Easing.out(Easing.quad), 
            reduceMotion: motion
		});
	}, [progress, animationDuration, progressValue]);

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: actualCircumference * (1 - progressValue.value),
	}));

	return (
		<View
			style={[styles.container, { width: size, height: size }, containerStyle]}
		>
			<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				{/* Background Track Circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={actualRadius}
					stroke={trackColor}
					fill="none"
					strokeWidth={strokeWidth}
					// Rotate by -90 degrees to start from the top
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
				{/* Animated Progress Circle */}
				<AnimatedCircle
					cx={size / 2}
					cy={size / 2}
					r={actualRadius}
					fill="none"
					stroke={progressColor}
					strokeWidth={strokeWidth}
					strokeDasharray={actualCircumference}
					animatedProps={animatedProps}
					strokeLinecap="round" 
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
			</Svg>
			{/* Children are absolutely positioned in the center */}
			{children && (
				<View style={[styles.childrenContainer, { width: size, height: size }]}>
					{children}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
	childrenContainer: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
});
