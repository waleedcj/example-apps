import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedProps,
	Easing,
	ReduceMotion,
	interpolate,
	useAnimatedStyle,
	Extrapolation,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const DEFAULT_SIZE = 100;
const DEFAULT_STROKE_WIDTH = 8;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type TransitioningProgressCircleProps = {
	progress: number; // Value between 0 and 1
	progressColor: string;
	trackColor: string;
	size?: number;
	strokeWidth?: number;
	animationDuration?: number; // Duration for progress animation
	successAnimationDuration?: number; // Duration for success icon animation
	children?: React.ReactNode;
	endIcon?: React.ReactElement;
	endIconColor?: string;
	containerStyle?: StyleProp<ViewStyle>;
	reduceMotion?: "never" | "always" | "system";
};

export default function TransitioningProgressCircle({
	progress,
	progressColor,
	trackColor,
	endIconColor,
	size = DEFAULT_SIZE,
	strokeWidth = DEFAULT_STROKE_WIDTH,
	animationDuration = 1000,
	successAnimationDuration = 500, // Separate duration for success animation
	children,
	containerStyle,
	reduceMotion = "system",
	endIcon,
}: TransitioningProgressCircleProps) {
	const actualRadius = (size - strokeWidth) / 2;
	const actualCircumference = 2 * Math.PI * actualRadius;

	const progressValue = useSharedValue(0);
	const successState = useSharedValue(0);

	const iconColor = endIconColor || progressColor;

	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const TIMING_CONFIG = {
		duration: successAnimationDuration,
		easing: Easing.out(Easing.quad),
		reduceMotion: motion,
	};
	useEffect(() => {
      
		const clampedProgress = Math.max(0, Math.min(1, progress));
		progressValue.value = withTiming(clampedProgress, {
			...TIMING_CONFIG,
			duration: animationDuration,
		});

		// Trigger success animation
		if (clampedProgress === 1) {
			successState.value = withTiming(1, TIMING_CONFIG);
		} else {
			// If progress drops below 1, hide success icon and show progress
			// (could also be withTiming(0) if you want it to animate out)
			if (successState.value === 1) {
				// Only reset if it was fully shown
				successState.value = withTiming(0, {
					...TIMING_CONFIG,
					duration: successAnimationDuration / 2,
				});
			}
		}
	}, [
		progress,
		animationDuration,
		successAnimationDuration,
		progressValue,
		successState,
	]);

	const animatedCircleProps = useAnimatedProps(() => ({
		strokeDashoffset: actualCircumference * (1 - progressValue.value),
	}));

	// style for the container of the progress circle and children (to fade them out)
	const progressElementsAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			successState.value,
			[0, 0.5, 1], // Start fading out early
			[1, 0, 0],
			Extrapolation.CLAMP
		);
		const scale = interpolate(
			successState.value,
			[0, 1],
			[1, 0.8], // Shrink slightly as it fades
			Extrapolation.CLAMP
		);
		return {
			opacity,
			transform: [{ scale }],
		};
	});

	// for the icon (to fade it in)
	const successIconAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			successState.value,
			[0, 0.5, 1], // Start fading in after progress starts fading out
			[0, 0, 1],
			Extrapolation.CLAMP
		);
		const scale = interpolate(
			successState.value,
			[0, 0.5, 1],
			[0.5, 1.1, 1], // Pop-in effect
			Extrapolation.CLAMP
		);
		return {
			opacity,
			transform: [{ scale }],
		};
	});

	const iconSize = size * 0.8; // icon will be 80% of the circle size

	return (
		<View
			style={[styles.container, { width: size, height: size }, containerStyle]}
		>
			{/* Container for Progress Circle and Children (will fade out) */}
			<Animated.View style={progressElementsAnimatedStyle}>
				<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={actualRadius}
						stroke={trackColor}
						fill="none"
						strokeWidth={strokeWidth}
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
					<AnimatedCircle
						cx={size / 2}
						cy={size / 2}
						r={actualRadius}
						fill="none"
						stroke={progressColor}
						strokeWidth={strokeWidth}
						strokeDasharray={actualCircumference}
						animatedProps={animatedCircleProps}
						strokeLinecap="round"
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
				</Svg>
				{children && (
					<View
						style={[styles.childrenContainer, { width: size, height: size }]}
					>
						{children}
					</View>
				)}
			</Animated.View>

			{/* Success Icon Container (will fade in) */}
			<Animated.View style={[styles.iconContainer, successIconAnimatedStyle]}>
				{endIcon ? (
					endIcon
				) : (
					<Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
						<AnimatedPath
							d="M20 6L9 17l-5-5"
							fill="none"
							stroke={iconColor}
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</Svg>
				)}
			</Animated.View>
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
	iconContainer: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
});
