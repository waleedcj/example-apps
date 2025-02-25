import {
	View,
	TextInput,
	StyleSheet,
	StyleProp,
	ViewStyle,
	TextInputProps,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	interpolate,
	interpolateColor,
	withTiming,
	Easing,
} from "react-native-reanimated";
import { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";

type FloatingTextInputProps = {
	containerStyle?: StyleProp<ViewStyle>;
	startIcon?: React.ReactNode;
	backgroundColor: string;
	label: string;
	isFocusLabelColor?: string;
	isBlurLabelColor?: string;
	isFocusBorderColor?: string;
	isBlurBorderColor?: string;
	isBlurValueBorderColor?: string;
};

export default function FloatingTextInput(
	props: React.JSX.IntrinsicAttributes &
		React.JSX.IntrinsicClassAttributes<TextInput> &
		Readonly<TextInputProps> &
		FloatingTextInputProps
) {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<TextInput>(null);
	const { colors } = useTheme();

	// Animation value for the floating label
	const animatedValue = useSharedValue(0);

	// Handle focus and blur events
	const handleFocus = () => {
		setIsFocused(true);
		animatedValue.value = withTiming(1, {
			duration: 200,
			easing: Easing.in(Easing.linear),
		});
	};

	const handleBlur = () => {
		setIsFocused(false);
		if (!props.value) {
			animatedValue.value = withTiming(0, {
				duration: 200,
				easing: Easing.out(Easing.linear),
			});
		}
	};

	// Animated styles for the floating label
	const labelStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(animatedValue.value, [0, 1], [0, -25]),
				},
				{
					scale: interpolate(animatedValue.value, [0, 1], [1, 0.85]),
				},
			],
			color: interpolateColor(
				animatedValue.value,
				[0, 1],
				[
					props.isBlurLabelColor ?? colors.Neutral300,
					props.isFocusLabelColor ?? colors.Neutral500,
				]
			),
			backgroundColor: interpolateColor(
				animatedValue.value,
				[0, 1],
				["transparent", props.backgroundColor]
			),
			paddingLeft: interpolate(animatedValue.value, [0, 1], [0, 4]),
			paddingRight: interpolate(animatedValue.value, [0, 1], [0, 4]),
			zIndex: 1,
		};
	});

	return (
		<View
			onTouchStart={() => inputRef?.current?.focus()}
			style={[styles.container, props?.containerStyle]}
		>
			<Animated.Text style={[styles.label, labelStyle]}>
				{props?.label}
			</Animated.Text>
			<TextInput
				ref={inputRef}
				clearButtonMode="always"
				style={[
					styles.input,
					{
						color: colors.Neutral700,
						backgroundColor: props?.backgroundColor ?? "transparent",
						borderColor: isFocused
							? (props.isFocusBorderColor ?? colors.PrimaryNormal)
							: props.value
								? (props.isBlurValueBorderColor ?? colors.Neutral500)
								: (props.isBlurBorderColor ?? colors.Neutral100),
					},
					props?.style,
				]}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...props}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
    flex: 1,
	},
	input: {
    width: "100%",
		height: 50,
		fontSize: 14,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		outline: "none",
	},
	label: {
		position: "absolute",
		top: 36,
		fontSize: 14,
		marginLeft: 16,
		zIndex: 100,
	},
});
