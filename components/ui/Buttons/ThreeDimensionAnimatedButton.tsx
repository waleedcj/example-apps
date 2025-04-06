import { ReactElement } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	ReduceMotion,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";

export interface AnimatedCartoonButtonProps {
	accessibilityHint?: string;
	accessibilityLabel?: string;
	Icon?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	onPress: () => void;
	title: string;
	reduceMotion?: "never" | "always" | "system";
}

const DURATION = 150; // Reduced duration often feels better for this effect
const BORDER_RADIUS = 8;
const HEIGHT = 42;
const SHADOW_HEIGHT = 8; // Thickness of the 3D effect "base"

const styles = StyleSheet.create({
	// This View contains both the shadow and the animated button content
	// Its height accommodates the button + the visible shadow part
	pressableContainer: {
		height: HEIGHT + SHADOW_HEIGHT,
		width: "100%", // Ensure it takes full width if needed
	},
	// The visible "base" or "shadow" of the 3D button
	shadow: {
		borderRadius: BORDER_RADIUS,
		height: HEIGHT,
		width: "100%",
		position: 'absolute', // Position it absolutely within the container
		bottom: 0,          // Stick it to the bottom
		left: 0,
	},
	// The main button content layer (the part that moves)
	buttonContent: {
		alignItems: "center",
		borderRadius: BORDER_RADIUS,
		flexDirection: "row",
		gap: 8,
		height: HEIGHT,
		justifyContent: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		width: "100%",
		position: 'absolute', // Position absolutely to allow moving it via 'top'
		left: 0,
		// top style is applied via animation
	},
	title: {
		flexShrink: 1,
		fontSize: 18,
		fontWeight: "600",
	},
});

export const ThreeDimensionAnimatedButton = ({
	accessibilityHint,
	accessibilityLabel,
	Icon,
	isDisabled = false,
	isLoading = false,
	onPress,
	title,
	reduceMotion = "system",
}: AnimatedCartoonButtonProps) => {
	const transition = useSharedValue(0); // 0 = up, 1 = pressed down
	const isActive = useSharedValue(false); // Track if press is still active
	const { colors } = useTheme();

	// Determine the ReduceMotion setting
	const motionSetting =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	// Define animation config once
	const timingConfigPress = {
		duration: DURATION,
		reduceMotion: motionSetting,
	};
	const timingConfigRelease = {
		duration: DURATION,
		reduceMotion: motionSetting,
	};

	const shadowColor = colors.PrimaryDisable || colors.PrimaryLightBackground; // Use a darker variant if available

	// Animated style for the main button content layer
	const animatedButtonStyle = useAnimatedStyle(() => {
		return {
			// Interpolate top position: 0 (up) to SHADOW_HEIGHT (down)
			top: interpolate(transition.value, [0, 1], [0, SHADOW_HEIGHT]),
			// Apply opacity for disabled state here
			opacity: isDisabled ? 0.5 : 1,
			// Set background color here
			backgroundColor: colors.PrimaryNormal, // Use your primary button color
		};
	});

	return (
		<Pressable
			accessibilityHint={accessibilityHint}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="button"
			accessibilityState={{
				busy: isLoading,
				disabled: isDisabled || isLoading,
			}}
			disabled={isDisabled || isLoading}
			
			onPress={onPress}
			onPressIn={() => {
				isActive.value = true;
				// Animate to pressed state (value = 1)
				transition.value = withTiming(1, timingConfigPress, (finished) => {
					// If released *during* the press animation, animate back up
					if (!isActive.value && finished !== false) { // Check finished is not explicitly false (interrupted)
						transition.value = withTiming(0, timingConfigRelease);
					}
				});
			}}
			onPressOut={() => {
				// Animate back to released state (value = 0) only if press animation completed or started
				if (transition.value > 0 || isActive.value) {
					transition.value = withTiming(0, timingConfigRelease);
				}
				isActive.value = false;
			}}
		>
			{/* Container View manages the total height and holds both layers */}
			<View style={styles.pressableContainer}>
				{/* Shadow Layer (Static) */}
				<View style={[styles.shadow, { backgroundColor: shadowColor }]} />

				{/* Button Content Layer (Animated) */}
				<Animated.View style={[styles.buttonContent, animatedButtonStyle]}>
					{isLoading ? (
						<ActivityIndicator color={colors.Neutral700} size={18} />
					) : (
						<>
							{Icon}
							<Text
								numberOfLines={1}
								style={[styles.title, { color: colors.Neutral700 }]}
							>
								{title}
							</Text>
						</>
					)}
				</Animated.View>
			</View>
		</Pressable>
	);
};