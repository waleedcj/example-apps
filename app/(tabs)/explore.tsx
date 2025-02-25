import FloatingTextInput from "@/components/ui/FloatingTextInput";
import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Keyboard,
	TextInput,
	ScrollView,
	Text,
	TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Octicons from "@expo/vector-icons/Octicons";

export default function TabTwoScreen() {
	const [text, onChangeText] = useState("");
	const [text1, onChangeText1] = useState("");
  const [text2, onChangeText2] = useState("");
  const [text3, onChangeText3] = useState("");
	const { colors } = useTheme();

	return (
		<SafeAreaView
			style={[
				styles.fullScreenContainer,
				{ backgroundColor: colors.Neutral50 },
			]}
		>
			<ScrollView
				style={styles.fullScreenContainer}
				contentContainerStyle={styles.contentContainer}
			>
				<SafeAreaView>
					<View style={{ flexDirection: "row", gap: 16, width: "100%" }}>
						<FloatingTextInput
							label="First Name"
							autoComplete="name"
							onChangeText={onChangeText}
							value={text}
							backgroundColor={colors.Neutral50}
						/>
						<FloatingTextInput
							label="Last Name"
							autoComplete="family-name"
							onChangeText={onChangeText1}
							value={text1}
							backgroundColor={colors.Neutral50}
						/>
					</View>
					<FloatingTextInput
						label="Phone Number"
						keyboardType="phone-pad"
						autoComplete="tel"
						onChangeText={onChangeText2}
						value={text2}
						backgroundColor={colors.Neutral50}
					/>
					<FloatingTextInput
						label="Email"
						autoComplete="email"
						onChangeText={onChangeText3}
						value={text3}
						backgroundColor={colors.Neutral50}
					/>
				</SafeAreaView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	fullScreenContainer: {
		flex: 1, // Takes up full screen height
	},
	contentContainer: {
		flexGrow: 1, // Ensures content can grow to fill ScrollView
		justifyContent: "center", // Centers vertically
		paddingHorizontal: 16,
	},
	input: {
		height: 40,
		width: "100%", // Optional: control width for better aesthetics
		borderWidth: 1,
		paddingHorizontal: 16,
	},
});
