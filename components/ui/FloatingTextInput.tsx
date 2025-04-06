import {
	View,
	TextInput,
	StyleSheet,
	StyleProp,
	ViewStyle,
	Text,
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
	isError?: boolean;
	errorMessage?: string;
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

	const getBorderColor = () => {
		if (props.isError) {
			return colors.ErrorNormal; // Error state takes priority
		}
		if (isFocused) {
			return props.isFocusBorderColor ?? colors.PrimaryNormal; // Focused state
		}
		if (props.value) {
			return props.isBlurValueBorderColor ?? colors.Neutral500; // Blurred but has value
		}
		return props.isBlurBorderColor ?? colors.Neutral100; // Blurred and empty
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
		};
	});

	return (
		<View style={[styles.outerContainer]}>
			<View
				onTouchStart={() => inputRef?.current?.focus()}
				style={[styles.container, props?.containerStyle]}
			>
				<Animated.Text
					style={[
						styles.label,
						labelStyle,
						{ backgroundColor: props.backgroundColor },
					]}
				>
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
							borderColor: getBorderColor(),
						},
						props?.style,
					]}
					onFocus={handleFocus}
					onBlur={handleBlur}
					{...props}
				/>
			</View>
			{props?.isError && (
				<Text style={[styles.errorText, { color: colors.ErrorNormal }]}>
					{props?.errorMessage}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	outerContainer: {
		marginBottom: 8,
	},
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
	errorText: {
		fontSize: 12,
	},
});
