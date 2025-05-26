import { ReactElement } from "react";
import {
	ActivityIndicator,
	Platform,
	Pressable,
	StyleSheet,
	Text,
} from "react-native";
import Animated, {
	interpolate,
	ReduceMotion,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export type AnimatedShadowButtonProps = {
	accessibilityHint?: string;
	accessibilityLabel?: string;
	elevation?: number;
	Icon?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	onPress: () => void;
	buttonColor: string;
	buttonShadowColor: string;
    textColor: string;
	title: string;
	reduceMotion?: "never" | "always" | "system";
}

const DURATION = 100;

export const ShadowAnimatedButton = ({
	accessibilityHint,
	accessibilityLabel,
	elevation = 16,
	Icon,
	isDisabled = false,
	isLoading = false,
	onPress,
	title,
	buttonColor,
	buttonShadowColor,
    textColor,
	reduceMotion = "system",
}: AnimatedShadowButtonProps) => {
	const transition = useSharedValue(0);
	const isActive = useSharedValue(false);

	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const animatedStyle = useAnimatedStyle(() =>
		Platform.OS === "android"
			? {
					elevation: interpolate(transition.value, [0, 1], [elevation, 0]),
				}
			: {
					shadowOffset: {
						width: 0,
						height: interpolate(transition.value, [0, 1], [elevation / 2, 0]),
					},
					shadowRadius: interpolate(
						transition.value,
						[0, 1],
						[elevation / 1.5, 0]
					),
				}
	);

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
				transition.value = withTiming(1, { duration: DURATION, reduceMotion: motion, }, () => {
					if (!isActive.value) {
						transition.value = withTiming(0, {
							duration: DURATION,
							reduceMotion: motion,
						});
					}
				});
			}}
			onPressOut={() => {
				if (isActive.value && transition.value === 1) {
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
					{
						opacity: isDisabled ? 0.5 : 1,
						backgroundColor: buttonColor,
						shadowColor: buttonShadowColor,
					},
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
		shadowOpacity: 0.5,
	},
	title: {
		flexShrink: 1,
		fontSize: 18,
		fontWeight: "600",
	},
});