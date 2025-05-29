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
const DEFAULT_INPUT_HEIGHT = 50; //you can change this according to your liking

type SmoothBorderTextInputProps = {
	containerStyle?: StyleProp<ViewStyle>;
	backgroundColor?: string;
	label: string;
	labelColor: string; // label color which is the top
	valueColor: string; // input value color
	isFocusBorderColor: string; // border color while editing
	isBlurBorderColor: string; //border color when there is no text value
	isBlurValueBorderColor: string; //border color when you finish entering the text
	startIcon?: React.ReactElement;
	isError?: boolean;
	errorMessage?: string;
	reduceMotion?: "never" | "always" | "system";
};

export default function SmoothBorderTextInput(
	props: React.JSX.IntrinsicAttributes &
		React.JSX.IntrinsicClassAttributes<TextInput> &
		Readonly<TextInputProps> &
		SmoothBorderTextInputProps
) {
	const inputRef = useRef<TextInput>(null);

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
			fromColor = "#F65936";
			toColor = "#F65936";
		} else {
			// No error state - handle normal cases
			if (props.value) {
				// Has value
				fromColor = props?.isBlurValueBorderColor;
			} else {
				// No value
				fromColor = props?.isBlurBorderColor;
			}

			// Focus color is always the same
			toColor = props.isFocusBorderColor;
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
			<Text style={[styles.label, { color: props?.labelColor}]}>
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
							color: props?.valueColor,
						},
						props?.style,
					]}
					onFocus={handleFocus}
					onBlur={handleBlur}
					{...props}
				/>
			</Animated.View>
			{props?.isError && (
				<Text style={[styles.errorText, { color: "#F65936" }]}>
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
