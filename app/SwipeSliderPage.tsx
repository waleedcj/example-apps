import React from "react";
import { ScrollView, View, StyleSheet, Alert, Text, Dimensions, SafeAreaView } from "react-native";
import SwipeSlider from "@/components/ui/Slider";
import { useAppColors } from "@/hooks/useAppColors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SwipeSliderPage() {
	const colors = useAppColors();
	const { width: screenWidth } = Dimensions.get("window");

	const handlePaymentComplete = () => {
		Alert.alert("Payment Slider", "Payment swipe complete! Navigating...");
		// Example navigation after a delay
		setTimeout(() => {
			// router.replace('/some-payment-success-route');
			console.log("Navigating after payment...");
		}, 1000);
	};

	const handleActionConfirm = () => {
		Alert.alert("Action Slider", "Action confirmed!");
	};

	const handleUnlockComplete = () => {
		Alert.alert("Unlock Slider", "Device Unlocked!");
	};

	const handleMinimalTaskComplete = () => {
		Alert.alert("Minimal Slider", "Task marked as done.");
	};

	return (
		<SafeAreaView>
			<ScrollView contentContainerStyle={styles.screenContainer}>
				<Text style={[styles.title, { color: colors.Neutral900 }]}>Swipe Slider Examples</Text>
				{/* Example 1: Payment Slider */}
				<View style={styles.sliderSection}>
					<Text style={[styles.sliderLabel, { color: colors.Neutral700 }]}>1. Payment Confirmation</Text>
					<SwipeSlider
						onSwipeComplete={handlePaymentComplete}
						initialTrackColor={colors.Neutral300} // A light grey for initial state
						completeTrackColor={colors.SuccessfulNormal} // Green for success
						sliderBackgroundColor={colors.Neutral0} // White handle
						textColor={colors.Neutral900} // Dark text on light handle, or white text on dark track
						initialText="Slide to Pay $50.00"
						completeText="Processing..."
						endIcon={<MaterialIcons name="payment" size={24} color={colors.SuccessfulNormal} />}
						startIcon={<MaterialIcons name="double-arrow" size={24} color={colors.SuccessfulNormal} />}
						borderRadius={25} // More rounded
						sliderTrackWidth={screenWidth * 0.9}
						sliderSize={60}
						sliderTrackHeight={70}
						enableHaptics={true}
						reduceMotion="never"
					/>
				</View>

				{/* Example 2: General Action Confirmation */}
				<View style={styles.sliderSection}>
					<Text style={[styles.sliderLabel, { color: colors.Neutral700 }]}>2. Confirm Action</Text>
					<SwipeSlider
						onSwipeComplete={handleActionConfirm}
						initialTrackColor={colors.PrimaryLightBackground}
						completeTrackColor={colors.PrimaryNormal}
						sliderBackgroundColor={colors.Neutral0}
						textColor={colors.PrimaryDisable} // Text color that contrasts with PrimaryNormal
						initialText="Slide to Confirm"
						completeText="Confirmed!"
						startIcon={<AntDesign name="doubleright" size={24} color={colors.SuccessfulLightBackground} />}
						endIcon={<AntDesign name="checkcircleo" size={24} color={colors.SuccessfulNormal} />}
						borderRadius={12}
						sliderSize={50}
						sliderTrackWidth={screenWidth * 0.85}
						sliderTrackHeight={60}
						reduceMotion="never"
					/>
				</View>

				{/* Example 3: Unlock Slider */}
				<View style={styles.sliderSection}>
					<Text style={[styles.sliderLabel, { color: colors.Neutral700 }]}>3. Slide to Unlock</Text>
					<SwipeSlider
						onSwipeComplete={handleUnlockComplete}
						initialTrackColor={colors.Neutral500}
						completeTrackColor={colors.SuccessfulLightBackground} // A vibrant accent color
						sliderBackgroundColor={colors.Neutral100} // Dark handle
						textColor={colors.Neutral900} // White text for dark handle/accent track
						initialText="Slide to Unlock"
						completeText="Unlocked"
						endIcon={<AntDesign name="unlock" size={26} color={colors.Neutral0} />}
						startIcon={<AntDesign name="lock" size={24} color={colors.Neutral0} />}
						borderRadius={50} // Fully circular handle and track ends
						sliderSize={55}
						sliderTrackWidth={screenWidth * 0.75}
						sliderTrackHeight={65}
						reduceMotion="never"
					/>
				</View>

				{/* Example 4: Minimalistic Task Completion */}
				<View style={styles.sliderSection}>
					<Text style={[styles.sliderLabel, { color: colors.Neutral700 }]}>4. Mark as Done (Minimal)</Text>
					<SwipeSlider
						onSwipeComplete={handleMinimalTaskComplete}
						initialTrackColor={colors.Neutral100}
						completeTrackColor={colors.Neutral500}
						sliderBackgroundColor={colors.Neutral0}
						textColor={colors.Neutral900}
						initialText="Slide if done"
						completeText="Done"
						startIcon={<AntDesign name="doubleright" size={24} color={colors.SuccessfulLightBackground} />}
						endIcon={<MaterialIcons name="done" size={20} color={colors.Neutral700} />}
						borderRadius={8}
						sliderSize={40}
						sliderTrackWidth={screenWidth * 0.6}
						sliderTrackHeight={50}
						textStyle={{ fontSize: 14 }} // Custom text style
						reduceMotion="never"
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screenContainer: {
		flexGrow: 1,
		alignItems: "center",
		paddingVertical: 20,
		paddingHorizontal: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 30,
		textAlign: "center",
	}, 
	sliderSection: {
		marginBottom: 40,
		width: "100%",
		alignItems: "center", // Center the slider component itself
	},
	sliderLabel: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 15,
	},
});
