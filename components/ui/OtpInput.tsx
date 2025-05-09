import React from "react";
import { useState, type RefObject } from "react";
import {
	TextInput,
	View,
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
	TextInputProps,
} from "react-native";

//you can change it from here or from the TextInputProps using style prop
const INPUT_SIZE = 48;
const INPUT_BORDER_RADIUS = 8;

type OTPInputProps = {
	codes: string[];
	refs: Array<RefObject<TextInput | null>>;
	errorMessages: string[] | null;
	onChangeCode: (text: string, index: number) => void;
	gap: number;
	inputBackgroundColor: string;
	inputTextColor: string;
	inputFocusedBorderColor: string;
	inputErrorBorderColor: string;
	inputErrorTextColor: string;
	containerStyle: StyleProp<ViewStyle>;
};

export default function OTPInput(
	props: React.JSX.IntrinsicAttributes &
		React.JSX.IntrinsicClassAttributes<TextInput> &
		Readonly<TextInputProps> &
		OTPInputProps
) {
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

	const handleFocus = (index: number) => setFocusedIndex(index);
	const handleBlur = () => setFocusedIndex(null);

	return (
		<View
			style={styles.container}
		>
			<View
				style={[
					styles.inputContainer,
					props?.containerStyle,
					{ gap: props?.gap },
				]}
			>
				{props?.codes.map((code, index) => (
					<TextInput
						key={index}
						autoComplete="one-time-code"
						enterKeyHint="done"
						style={[
							styles.input,
							props?.errorMessages && {
								borderColor: props.inputErrorBorderColor,
								color: props?.inputErrorTextColor,
							},
							focusedIndex === index && {
								borderColor: props.inputFocusedBorderColor,
							},
							{
								backgroundColor: props?.inputBackgroundColor,
								color: props?.inputTextColor,
							},
						]}
						inputMode="numeric"
						onChangeText={(text) => props.onChangeCode(text, index)}
						value={code}
						onFocus={() => handleFocus(index)}
						onBlur={handleBlur}
						maxLength={index === 0 ? 6 : 1}
						ref={props.refs[index]}
						onKeyPress={({ nativeEvent: { key } }) => {
							if (key === "Backspace" && index > 0) {
								props.onChangeCode("", index - 1);
								props.refs[index - 1]!.current!.focus();
							}
						}}
						{...props}
					/>
				))}
			</View>
			{props.errorMessages && (
				<Text style={{ color: props?.inputErrorTextColor }}>
					{props.errorMessages[0]}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
	},
	inputContainer: {
		flexDirection: "row",
		width: "100%",
	},
	input: {
		fontSize: 20,
		fontWeight: "500",
		height: INPUT_SIZE,
		width: INPUT_SIZE,
		borderRadius: INPUT_BORDER_RADIUS,
		textAlign: "center",
		borderWidth: 1,
	},
});
