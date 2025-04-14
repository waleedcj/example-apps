import { ReactElement } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
	interpolate,
	ReduceMotion,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useAppColors } from '@/hooks/useAppColors';

export interface ResizingButtonProps {
	accessibilityHint?: string;
	accessibilityLabel?: string;
	Icon?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	onPress: () => void;
	scale?: number;
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
	},
	title: {
		flexShrink: 1,
		fontSize: 18,
		fontWeight: "600",
	},
});

export const ScaleAnimatedButton = ({
	accessibilityHint,
	accessibilityLabel,
	Icon,
	isDisabled = false,
	isLoading = false,
	onPress,
	scale = 0.95,
	title,
	reduceMotion = "system",
}: ResizingButtonProps) => {
	const transition = useSharedValue(0);
	const isActive = useSharedValue(false);
	const colors = useAppColors();

	const motion =
		reduceMotion === "never"
			? ReduceMotion.Never
			: reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: interpolate(transition.value, [0, 1], [1, scale]),
			},
		],
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
					{
						opacity: isDisabled ? 0.9 : 1,
						backgroundColor: colors.PrimaryNormal,
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
