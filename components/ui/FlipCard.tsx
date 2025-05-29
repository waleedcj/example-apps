import React from "react";
import {View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated, { interpolate, ReduceMotion, SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

type FlipCardProps = {
	isFlipped: SharedValue<boolean>; // The shared value controlling the flip state
	cardStyle?: StyleProp<ViewStyle>; // Style for both front and back card containers
	direction?: "x" | "y"; // Flip direction
	duration?: number; // Animation duration in milliseconds
	RegularContent: React.ReactNode; // Content for the front of the card
	FlippedContent: React.ReactNode; // Content for the back of the card
    reduceMotion?: "always" | "never" | "system";
};

export default function FlipCard({
	isFlipped,
	cardStyle,
	direction = "y",
	duration = 500,
	RegularContent,
	FlippedContent,
    reduceMotion= 'system'
}: FlipCardProps) {
	const isDirectionX = direction === "x";
    const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const regularCardAnimatedStyle = useAnimatedStyle(() => {
		const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
		const rotateValue = withTiming(`${spinValue}deg`, { duration, reduceMotion: motion });

		return {
			transform: [isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
		};
	});

	const flippedCardAnimatedStyle = useAnimatedStyle(() => {
		const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
		const rotateValue = withTiming(`${spinValue}deg`, { duration, reduceMotion: motion  });

		return {
			transform: [isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
		};
	});

	return (
		<View>
			<Animated.View style={[flipCardStyles.regularCard, cardStyle, regularCardAnimatedStyle]}>
				{RegularContent}
			</Animated.View>
			<Animated.View style={[flipCardStyles.flippedCard, cardStyle, flippedCardAnimatedStyle]}>
				{FlippedContent}
			</Animated.View>
		</View>
	);
}

const flipCardStyles = StyleSheet.create({
	regularCard: {
		position: "absolute",
		zIndex: 1,
	},
	flippedCard: {
		zIndex: 2,
	},
});