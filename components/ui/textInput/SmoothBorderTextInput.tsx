import {
	View,
	TextInput,
	StyleSheet,
	StyleProp,
	ViewStyle,
	TextInputProps,
	Text,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	interpolateColor,
	withTiming,
	Easing,
	ReduceMotion,
} from "react-native-reanimated";
import { useRef } from "react";
import { useAppColors } from '@/hooks/useAppColors';
const DEFAULT_INPUT_HEIGHT = 50; //you can change this according to your liking

type FloatingTextInputProps = {
	containerStyle?: StyleProp<ViewStyle>;
	backgroundColor: string;
	label: string;
	startIcon?: React.ReactNode;
	isError?: boolean;
	errorMessage?: string;
	isFocusLabelColor?: string;
	isBlurLabelColor?: string;
	isFocusBorderColor?: string;
	isBlurBorderColor?: string;
	isBlurValueBorderColor?: string;
	reduceMotion?: "never" | "always" | "system";
};



export default function SmoothBorderTextInput(
	props: React.JSX.IntrinsicAttributes &
		React.JSX.IntrinsicClassAttributes<TextInput> &
		Readonly<TextInputProps> &
		FloatingTextInputProps
) {
	const inputRef = useRef<TextInput>(null);
	const colors = useAppColors();

	// Animation value for the floating label
	const animatedValue = useSharedValue(0);

	const motion =
	props?.reduceMotion === "never"
			? ReduceMotion.Never
			: props?.reduceMotion === "always"
				? ReduceMotion.Always
				: ReduceMotion.System;

	// Handle focus and blur events
	const handleFocus = () => {
		animatedValue.value = withTiming(1, {
			duration: 350,
			easing: Easing.in(Easing.linear),
			reduceMotion: motion,
		});
	};

	const handleBlur = () => {
		animatedValue.value = withTiming(0, {
			duration: 250,
			easing: Easing.out(Easing.linear),
			reduceMotion: motion,
		});
	};

	const BorderStyle = useAnimatedStyle(() => {
		// Define the "from" color (unfocused state)
		let fromColor;
		// Define the "to" color (focused state)
		let toColor;

		if (props.isError) {
			// Error state - always red regardless of focus
			fromColor = colors.ErrorNormal;
			toColor = colors.ErrorNormal;
		} else {
			// No error state - handle normal cases
			if (props.value) {
				// Has value
				fromColor = props.isBlurValueBorderColor ?? colors.Neutral500;
			} else {
				// No value
				fromColor = props.isBlurBorderColor ?? colors.Neutral100;
			}

			// Focus color is always the same
			toColor = props.isFocusBorderColor ?? colors.PrimaryNormal;
		}

		return {
			borderColor: interpolateColor(
				animatedValue.value,
				[0, 1],
				[fromColor, toColor]
			),
			zIndex: 1,
		};
	});

	return (
		<View style={{ marginBottom: 16 }}>
			<Text style={[styles.label, { color: colors.Neutral500 }]}>
				{props?.label}
			</Text>
			<Animated.View
				// onTouchStart={() => inputRef?.current?.focus()}
				style={[
					styles.container,
					{
						backgroundColor: props?.backgroundColor ?? "transparent",
					},
					BorderStyle,
				]}
			>
				{!!props?.startIcon && (
					<View style={styles.iconContainer}>{props.startIcon}</View>
				)}
				<TextInput
					ref={inputRef}
					clearButtonMode="while-editing"
					style={[
						styles.input,
						{
							color: colors.Neutral700,
						},
						props?.style,
					]}
					onFocus={handleFocus}
					onBlur={handleBlur}
					{...props}
				/>
			</Animated.View>
			{props?.isError && (
				<Text style={[styles.errorText, { color: colors.ErrorNormal }]}>
					{props?.errorMessage}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		// position: "relative",
		alignItems: "center",
		marginBlock: 4,
		borderWidth: 1,
		borderRadius: 12,
		height: DEFAULT_INPUT_HEIGHT,
	},
	input: {
		flex: 1,
		fontSize: 14,
		borderRadius: 12,
		padding: 12,
		height: "100%",
		outline: "none",
	},
	label: {
		fontSize: 14,
		marginLeft: 8,
		zIndex: 100,
	},
	errorText: {
		fontSize: 12,
	},
	iconContainer: {
		zIndex: 2
	},
});
