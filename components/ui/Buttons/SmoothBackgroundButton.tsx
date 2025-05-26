import { ReactElement } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	ReduceMotion,
} from "react-native-reanimated";

export type AnimatedBackgroundButtonProps = {
	accessibilityHint?: string;
	accessibilityLabel?: string;
	Icon?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	onPress: () => void;
	title: string;
	buttonColor: string;
    buttonTouchColor: string;
    textColor: string;
	reduceMotion?: "never" | "always" | "system";
}

const DURATION = 200;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		borderRadius: 8,
		flexDirection: "row",
		gap: 8,
		height: 42,
		justifyContent: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	title: {
		flexShrink: 1,
		fontSize: 18,
		fontWeight: "600",
	},
});

export const SmoothBackgroundButton = ({
	accessibilityHint,
	accessibilityLabel,
	Icon,
	isDisabled = false,
	isLoading = false,
	onPress,
	title,
	buttonColor,
    buttonTouchColor,
    textColor,
	reduceMotion = "system",
}: AnimatedBackgroundButtonProps) => {
	const transition = useSharedValue(0);
	const isActive = useSharedValue(false);

	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			transition.value,
			[0, 1],
			[buttonColor, buttonTouchColor]
		),
	}));

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
				transition.value = withTiming(1, { duration: DURATION, reduceMotion: motion }, () => {
					if (!isActive.value) {
						transition.value = withTiming(0, {
							duration: DURATION,
							reduceMotion: motion
						});
					}
				});
			}}
			onPressOut={() => {
				if (transition.value === 1) {
					transition.value = withTiming(0, {
						duration: DURATION,
						reduceMotion: motion,
					});
				}
				isActive.value = false;
			}}
		>
			<Animated.View
				style={[
					styles.container,
					animatedStyle,
					{ opacity: isDisabled ? 0.8 : 1 },
				]}
			>
				{isLoading ? (
					<ActivityIndicator color={textColor} size={18} />
				) : (
					<>
						{Icon}
						<Text
							numberOfLines={1}
							style={[styles.title, { color: textColor }]}
						>
							{title}
						</Text>
					</>
				)}
			</Animated.View>
		</Pressable>
	);
};
