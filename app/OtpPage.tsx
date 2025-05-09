import React, { RefObject, useRef, useState } from "react";
import {
	Keyboard,
	SafeAreaView,
	TextInput,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	Alert,
    Text
} from "react-native";
import { useAppColors } from "@/hooks/useAppColors";
import OTPInput from "@/components/ui/OtpInput";

export default function OtpPage() {
	const colors = useAppColors();
	//states
	const dummyCode = "123456";
	const inputRef = useRef<TextInput>(null);
	const [codes, setCodes] = useState<string[] | null>(Array(6).fill(""));
	const refs: Array<RefObject<TextInput | null>> = [
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
	];
	const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

	//functions
	const onChangeCode = (text: string, index: number) => {
		setErrorMessages(null);
		let newCodes: string[] = [];

		if (text.length > 1) {
			// Handle auto-fill scenario
			newCodes = text.trim().split("").slice(0, 6); // Ensure only 6 digits
			setCodes(newCodes);

			// Move focus to the last input
			refs[5]?.current?.focus();
		} else {
			// Handle manual input
			newCodes = [...(codes || [])];
			newCodes[index] = text;
			setCodes(newCodes);

			// Move focus to the next input if not the last one
			if (text !== "" && index < 5) {
				refs[index + 1]?.current?.focus();
			}
		}

		// Check if the OTP is complete and trigger verification
		if (newCodes.join("").length === 6) {
			handleVerification(newCodes.join(""));
		}
	};

	const handleVerification = async (codes: string) => {
		console.log("Verifying code...", codes);

		// you can add a api call here this is just a mock even activity indicators with a resend button
		if (dummyCode == codes) {
			Alert.alert("Verification Complete, Navigating");
            resetCode();
		} else {
			setErrorMessages(["Invalid OTP. Please try again."]);
		}
	};

    const resetCode = () => {
        setCodes(Array(6).fill(""));
        setErrorMessages(null);
        refs[0]!.current?.focus();
      };

	return (
		<SafeAreaView style={styles.screenContainer}>
				<Text style={{ color: colors.Neutral700, marginBottom: 16 }}>
					Enter OTP: {dummyCode}
				</Text>
				<View
					onTouchStart={() => {
						inputRef.current?.focus();
					}}
					style={{
						flexDirection: "row",
						gap: 8,
					}}
				>
					<OTPInput
						codes={codes!}
						errorMessages={errorMessages}
						onChangeCode={onChangeCode}
						refs={refs}
						gap={8}
						inputBackgroundColor={colors.Neutral100}
						inputTextColor={colors.Neutral900}
						inputFocusedBorderColor={colors.PrimaryNormal}
						inputErrorBorderColor={colors.ErrorNormal}
						inputErrorTextColor={colors.ErrorNormal}
						containerStyle={{ marginBottom: 20 }} // Style for the row of inputs
					/>
				</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
});
