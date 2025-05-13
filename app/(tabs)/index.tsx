import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
	KeyboardAvoidingView,
	Platform,
	Image,
	Button,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import {
	Ionicons,
	Octicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import SmoothBorderTextInput from "@/components/ui/textInput/SmoothBorderTextInput";
import Animated, {
	useAnimatedKeyboard,
	useAnimatedStyle,
} from "react-native-reanimated";
import { SmoothBackgroundButton } from "@/components/ui/Buttons/SmoothBackgroundButton";
import { ScaleAnimatedButton } from "@/components/ui/Buttons/ScaleAnimatedButton";
import { ShadowAnimatedButton } from "@/components/ui/Buttons/ShadowAnimatedButton";
import { ThreeDimensionAnimatedButton } from "@/components/ui/Buttons/ThreeDimensionAnimatedButton";
import { IconAnimatedButton } from "@/components/ui/Buttons/IconAnimatedButton";
import { StepAnimatedButton } from "@/components/ui/Buttons/StepAnimatedButton";
import { GradientButton } from "@/components/ui/Buttons/GradientButton";
import { PulseAnimatedButton } from "@/components/ui/Buttons/PulseAnimatedButton";
import { useRouter } from 'expo-router';

export default function HomeScreen() {
	const { colors } = useTheme();
	const keyboard = useAnimatedKeyboard();
	const [currentStep, setCurrentStep] = useState(0);
	const router = useRouter();

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateY: -keyboard.height.value }],
	}));

	const [isLoading, setIsLoading] = useState(false);

	// Handler to simulate loading
	const handleLoadingPress = () => {
		if (isLoading) return; // Prevent multiple presses while loading

		setIsLoading(true);

		// Simulate an async task (e.g., API call)
		setTimeout(() => {
			setIsLoading(false);
		}, 2500); // Stop loading after 2.5 seconds
	};

	const Icon = (
		<MaterialCommunityIcons
			accessible={false}
			color={colors.Neutral700}
			name="send"
			size={18}
		/>
	);

	const download = () => {
		setCurrentStep(1);
		setTimeout(() => {
			setCurrentStep(2);
		}, 2000);
		setTimeout(() => {
			setCurrentStep(0);
		}, 4000);
	};

	// Form state
	const [formData, setFormData] = useState({
		cardName: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		zipCode: "",
	});

	// Error state
	const [errors, setErrors] = useState({
		cardName: false,
		cardNumber: false,
		expiryDate: false,
		cvv: false,
		zipCode: false,
	});

	// Focus state for animation effects
	const [focusedField, setFocusedField] = useState(null);

	// Handle input changes
	const handleChange = (field, value) => {
		// Format card number with spaces
		if (field === "cardNumber") {
			value = value
				.replace(/\s/g, "")
				.replace(/(.{4})/g, "$1 ")
				.trim();
		}

		// Format expiry date with slash
		if (field === "expiryDate") {
			if (value.length === 2 && formData.expiryDate.length === 1) {
				value = value + "/";
			}
			value = value.replace(/[^0-9/]/g, "");
		}

		// Limit CVV to 3-4 digits
		if (field === "cvv") {
			value = value.replace(/[^0-9]/g, "").substring(0, 4);
		}

		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear error when typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: false }));
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {
			cardName: !formData.cardName,
			cardNumber: !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber),
			expiryDate: !/^\d{2}\/\d{2}$/.test(formData.expiryDate),
			cvv: !/^\d{3,4}$/.test(formData.cvv),
			zipCode: !formData.zipCode,
		};

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error);
	};

	// Handle form submission
	const handleSubmit = () => {
		if (validateForm()) {
			console.log("Payment submitted:", formData);
			// Process payment logic here
		}
	};

	// Get card brand logo based on first digits
	const getCardBrand = () => {
		const number = formData.cardNumber.replace(/\s/g, "");
		if (!number) return null;

		if (number.startsWith("4")) {
			return { name: "Visa", color: "#1A1F71" };
		} else if (/^5[1-5]/.test(number)) {
			return { name: "Mastercard", color: "#EB001B" };
		} else if (/^3[47]/.test(number)) {
			return { name: "American Express", color: "#006FCF" };
		} else if (/^6(?:011|5)/.test(number)) {
			return { name: "Discover", color: "#FF6000" };
		}
		return null;
	};

	const cardBrand = getCardBrand();

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoid}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.formHeader}>
						<View style={styles.securePaymentRow}>
							<Ionicons name="shield-checkmark" size={22} color="#10B981" />
							<Text style={styles.securePaymentText}>Secure Payment</Text>
						</View>
						<Text style={styles.formTitle}>Payment Details</Text>
						<Text style={styles.formSubtitle}>
							Complete your purchase by providing your payment details
						</Text>
					</View>

					<View style={styles.cardIllustration}>
						<View
							style={[
								styles.cardPreview,
								{ backgroundColor: cardBrand?.color || "#6366F1" },
							]}
						>
							<View style={styles.cardChip}>
								{cardBrand && (
									<Text style={styles.cardBrandText}>{cardBrand.name}</Text>
								)}
							</View>

							<Text style={styles.cardNumberPreview}>
								{formData.cardNumber || "•••• •••• •••• ••••"}
							</Text>

							<View style={styles.cardDetails}>
								<View>
									<Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
									<Text style={styles.cardDetailValue}>
										{formData.cardName || "Your Name"}
									</Text>
								</View>
								<View>
									<Text style={styles.cardDetailLabel}>EXPIRES</Text>
									<Text style={styles.cardDetailValue}>
										{formData.expiryDate || "MM/YY"}
									</Text>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.formContainer}>
						{/* Card Name */}
						<SmoothBorderTextInput
							label="Cardholder Name"
							placeholder="Name on card"
							value={formData.cardName}
							onChangeText={(text) => handleChange("cardName", text)}
							backgroundColor={colors.background}
							startIcon={
								<AntDesign
									name="user"
									size={18}
									style={{ left: 12, marginRight: 4 }}
									color={colors.Neutral300}
								/>
							}
							isError={errors.cardName}
							errorMessage="Cardholder name is required"
							autoCapitalize="words"
						/>

						{/* Card Number */}
						<SmoothBorderTextInput
							label="Card Number"
							placeholder="1234 5678 9012 3456"
							value={formData.cardNumber}
							onChangeText={(text) => handleChange("cardNumber", text)}
							backgroundColor={colors.background}
							isError={errors.cardNumber}
							errorMessage="Enter a valid 16-digit card number"
							keyboardType="number-pad"
							maxLength={19} // 16 digits + 3 spaces
						/>

						{/* Row for Expiry and CVV */}
						<View style={styles.rowInputs}>
							<View style={styles.halfInput}>
								<SmoothBorderTextInput
									label="Expiry Date"
									placeholder="MM/YY"
									value={formData.expiryDate}
									onChangeText={(text) => handleChange("expiryDate", text)}
									backgroundColor={colors.background}
									isError={errors.expiryDate}
									errorMessage="Invalid date"
									keyboardType="number-pad"
									maxLength={5} // MM/YY
								/>
							</View>

							<View style={styles.halfInput}>
								<SmoothBorderTextInput
									label="CVV"
									placeholder="123"
									value={formData.cvv}
									onChangeText={(text) => handleChange("cvv", text)}
									backgroundColor={colors.background}
									isError={errors.cvv}
									errorMessage="Invalid CVV"
									keyboardType="number-pad"
									maxLength={4}
									secureTextEntry
								/>
							</View>
						</View>

						{/* Billing Zip Code */}
						<SmoothBorderTextInput
							label="Billing Zip Code"
							placeholder="Enter zip code"
							value={formData.zipCode}
							onChangeText={(text) => handleChange("zipCode", text)}
							backgroundColor={colors.background}
							isError={errors.zipCode}
							errorMessage="Zip code is required"
							keyboardType="number-pad"
						/>

						{/* <TouchableOpacity
							style={styles.payButton}
							onPress={handleSubmit}
							activeOpacity={0.8}
						>
							<Text style={styles.payButtonText}>Pay Now</Text>
						</TouchableOpacity> */}
						<PulseAnimatedButton
							onPress={() => router.navigate('/ImageCarouselPage')}
							title="Pay Up"
							reduceMotion="never"
						/>
						<ShadowAnimatedButton
						onPress={() => router.navigate('/SwipeSliderPage')}
							title="Pay Up"
							reduceMotion="never"
							Icon={Icon}
						/>
						<IconAnimatedButton
							onPress={() => router.navigate('/ProgressCirclePage')}
							title="Pay Up"
							reduceMotion="never"
							Icon={Icon}
						/>
						<SmoothBackgroundButton
							onPress={() => router.navigate('/TabBarPage')}
							isLoading={isLoading}
							title="Pay Up"
							reduceMotion="never"
							Icon={Icon}
						/>
						<ScaleAnimatedButton
								onPress={() => router.navigate('/SkeletonPage')}
							isLoading={isLoading}
							// isDisabled={true}
							title="Pay Up"
							reduceMotion="never"
							Icon={
								<MaterialIcons
									name="payment"
									size={24}
									color={colors.Neutral700}
								/>
							}
						/>
						<ThreeDimensionAnimatedButton
							onPress={() => router.navigate('/AnimatedHeader')}
							title="Pay Up"
							reduceMotion="never"
						/>
						<GradientButton onPress={() => router.navigate('/OnboardingPage')} title="Pay Up" />
						<StepAnimatedButton
							currentStep={currentStep}
							onPress={download}
							steps={[
								{
									Icon: (
										<MaterialCommunityIcons
											accessible={false}
											color={colors.Neutral700}
											name="download"
											size={18}
										/>
									),
									title: "Download",
								},
								{
									Icon: (
										<MaterialCommunityIcons
											accessible={false}
											color={colors.Neutral700}
											name="progress-download"
											size={18}
										/>
									),
									title: "Downloading...",
								},
								{
									Icon: (
										<MaterialCommunityIcons
											accessible={false}
											color={colors.Neutral700}
											name="check"
											size={18}
										/>
									),
									title: "Downloaded",
								},
							]}
							reduceMotion="system"
						/>
						<Button
							onPress={() => router.navigate('/OtpPage')}
							title="OTPPAGE"
						/>
							<Button
							onPress={() => router.navigate('/MyInsightsPage')} 
							title="Insights"
						/>
						
							<Button
							onPress={() => router.navigate('/TransitioningProgressCirclePage')}
							title="TransitioningProgressCirclePage"
						/>

						<View style={styles.securityNote}>
							<Ionicons name="lock-closed" size={16} color="#6B7280" />
							<Text style={styles.securityText}>
								Your data is encrypted and secure. We respect your privacy.
							</Text>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		// backgroundColor: '#FFFFFF',
	},
	keyboardAvoid: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		padding: 20,
	},
	formHeader: {
		marginBottom: 24,
	},
	securePaymentRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	securePaymentText: {
		color: "#10B981",
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 6,
	},
	formTitle: {
		fontSize: 26,
		fontWeight: "700",
		color: "#1F2937",
		marginBottom: 8,
	},
	formSubtitle: {
		fontSize: 15,
		color: "#6B7280",
		lineHeight: 22,
	},
	cardIllustration: {
		alignItems: "center",
		marginVertical: 20,
	},
	cardPreview: {
		width: "100%",
		height: 200,
		borderRadius: 16,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	cardChip: {
		width: 40,
		height: 30,
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		borderRadius: 6,
		marginBottom: 30,
	},
	cardNumberPreview: {
		color: "#FFFFFF",
		fontSize: 22,
		fontWeight: "600",
		letterSpacing: 2,
		marginBottom: 30,
	},
	cardDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cardDetailLabel: {
		color: "rgba(255, 255, 255, 0.7)",
		fontSize: 10,
		marginBottom: 5,
	},
	cardDetailValue: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "500",
	},
	cardBrandContainer: {
		position: "absolute",
		bottom: 24,
		right: 24,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	cardBrandText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 12,
	},
	formContainer: {
		marginTop: 20,
	},
	rowInputs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	halfInput: {
		flex: 0.48,
	},
	payButton: {
		backgroundColor: "#6366F1",
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 30,
		marginBottom: 16,
		shadowColor: "#6366F1",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 8,
	},
	payButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	securityNote: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 16,
	},
	securityText: {
		color: "#6B7280",
		fontSize: 13,
		marginLeft: 6,
	},
});
