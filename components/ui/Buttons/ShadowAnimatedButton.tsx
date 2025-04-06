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
import { useTheme } from "@react-navigation/native";

export interface AnimatedShadowButtonProps {
	accessibilityHint?: string;
	accessibilityLabel?: string;
	elevation?: number;
	Icon?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	onPress: () => void;
	title: string;
	reduceMotion?: "never" | "always" | "system";
}

const DURATION = 300;

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

export const ShadowAnimatedButton = ({
	accessibilityHint,
	accessibilityLabel,
	elevation = 16,
	Icon,
	isDisabled = false,
	isLoading = false,
	onPress,
	title,
	reduceMotion = "system",
}: AnimatedShadowButtonProps) => {
	const transition = useSharedValue(0);
	const isActive = useSharedValue(false);
	const { colors } = useTheme();

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
				transition.value = withTiming(1, { duration: DURATION }, () => {
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
						backgroundColor: colors.PrimaryNormal,
						shadowColor: colors.Neutral300,
					},
				]}
			>
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
		</Pressable>
	);
};
