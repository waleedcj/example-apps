import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	useWindowDimensions,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useAppColors } from "@/hooks/useAppColors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmoothBorderTextInput from "@/components/ui/textInput/SmoothBorderTextInput";
import Animated, {
	Easing,
	ReduceMotion,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { luhnChk, validateExpiryDate } from "@/utils/validateInfo";


const DEFAULT_GRADIENT: [string, string] = ["#CDCDCD", "#A0A0A0"]; // Light Grey to Darker Grey
const VISA_GRADIENT: [string, string] = ["#1A1F71", "#6366F1"]; // Dark Blue to Lighter Blue/Purple
const MASTERCARD_GRADIENT: [string, string] = ["#EB001B", "#FF5F00"]; // Red to Orange
const AMEX_GRADIENT: [string, string] = ["#006FCF", "#00A4E0"]; // Blue to Lighter Blue

const CARD_HEIGHT = 225;

type FormField = "cardName" | "cardNumber" | "expiryDate" | "cvv";

export default function CardDetailsFormPage() {
	const { width: screenWidth } = useWindowDimensions();
	const colors = useAppColors();
	const motion = ReduceMotion.Never;

	const [activeGradient, setActiveGradient] = useState<[string, string]>(DEFAULT_GRADIENT);
	const [ActiveLogoComponent, setActiveLogoComponent] = useState(() => <></>); // Initialize
	const [isLoading, setIsLoading] = useState(false);

	const cardVisualsOpacity = useSharedValue(1); // Opacity for the current card visuals

	// Form state
	const [formData, setFormData] = useState({
		cardName: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
	});

	// Error state
	const [errors, setErrors] = useState({
		cardName: false,
		cardNumber: false,
		expiryDate: false,
		cvv: false,
	});

	// Handle input changes
	const handleChange = (field: FormField, value: string) => {
		// Format card number with spaces
		if (field === "cardNumber") {
            value = value
                .replace(/[^0-9]/g, "")
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
			cardNumber: !luhnChk(formData.cardNumber.replace(/\s/g, "")),
			expiryDate: !validateExpiryDate(formData.expiryDate),
			cvv: !/^\d{3,4}$/.test(formData.cvv),
		};

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error);
	};

	// Handle form submission
	const handleSubmit = () => {
        console.log(formData.cardNumber);
		if (validateForm()) {
			setIsLoading(true);

			// Simulate API call with setTimeout
			setTimeout(() => {
				console.log("Payment submitted:", formData);

				Alert.alert("Success", "Payment processed successfully!", [
					{
						text: "OK",
						onPress: () => {
							// Clear form data
							setFormData({
								cardName: "",
								cardNumber: "",
								expiryDate: "",
								cvv: "",
							});
							setIsLoading(false);
						},
					},
				]);
			}, 1500);
		}
	};

	// Get card brand logo based on first digits
	const getCardBrandDetails = () => {
		const number = formData.cardNumber.replace(/\s/g, "");
		if (!number) return { name: "CARD", gradient: DEFAULT_GRADIENT, Logo: () => <></> };
		if (number.startsWith("4")) {
			// Visa
			return { name: "VISA", gradient: VISA_GRADIENT, Logo: VisaIcon };
		} else if (/^5[1-5]/.test(number)) {
			// Mastercard
			return { name: "Mastercard", gradient: MASTERCARD_GRADIENT, Logo: MastercardIcon };
		} else if (/^3[47]/.test(number)) {
			// Amex
			return { name: "American Express", gradient: AMEX_GRADIENT, Logo: AmexIcon };
		}
		return { name: "CARD", gradient: DEFAULT_GRADIENT, Logo: () => <></> };
	};

	useEffect(() => {
		const newDetails = getCardBrandDetails();

		// Only proceed if the actual brand (determined by name or gradient) changes
		if (newDetails.gradient[0] !== activeGradient[0] || newDetails.gradient[1] !== activeGradient[1]) {
			const animConfigOut = { duration: 200, easing: Easing.out(Easing.ease), reduceMotion: motion }; // Faster fade out
			const animConfigIn = { duration: 300, easing: Easing.in(Easing.ease), reduceMotion: motion }; // Slightly slower fade in

			// 1. Fade out current visuals
			cardVisualsOpacity.value = withTiming(0, animConfigOut, (finished) => {
				if (finished) {
					// 2. Update state for gradient and logo (this happens on JS thread)
					//    This will cause a re-render with the new gradient/logo, but they are still at opacity 0.
					runOnJS(setActiveGradient)(newDetails.gradient);
					runOnJS(setActiveLogoComponent)(newDetails.Logo);
					// 3. Fade in new visuals (this starts on UI thread after state update is processed)
					cardVisualsOpacity.value = withTiming(1, animConfigIn);
				}
			});
		}
	}, [formData.cardNumber]);

	const animatedCardVisualsStyle = useAnimatedStyle(() => ({
		opacity: cardVisualsOpacity.value,
	}));

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
				<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
					<View style={styles.formHeader}>
						<View style={styles.securePaymentRow}>
							<Ionicons name="shield-checkmark" size={22} color={colors.SuccessfulNormal} />
							<Text style={[styles.securePaymentText, { color: colors.SuccessfulNormal }]}>Secure Payment</Text>
						</View>
						<Text style={[styles.formTitle, { color: colors.Neutral700 }]}>Payment Details</Text>
						<Text style={[styles.formSubtitle, { color: colors.Neutral300 }]}>
							Complete your purchase by providing your payment details
						</Text>
					</View>

					<View style={[styles.cardIllustration]}>
						<View style={[styles.cardPreviewContainer, { width: screenWidth - 32 }]}>
							{/* Current Gradient (fades in) */}
							<Animated.View style={[StyleSheet.absoluteFill, animatedCardVisualsStyle]}>
								<LinearGradient
									colors={activeGradient}
									style={styles.gradientBase}
									start={{ x: 0.0, y: 0.0 }}
									end={{ x: 1.0, y: 1.0 }}
								/>
							</Animated.View>

							{/* Card Content Overlay - always visible on top */}
							<View style={styles.cardContentOverlay}>
								<View style={styles.cardHeaderTop}>
									<Chip />
									<Animated.View style={[animatedCardVisualsStyle]}>{ActiveLogoComponent}</Animated.View>
								</View>
								<Text style={styles.cardNumberPreview}>{formData.cardNumber || "•••• •••• •••• ••••"}</Text>
								<View style={styles.cardDetails}>
									<View>
										<Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
										<Text style={styles.cardDetailValue} numberOfLines={1}>
											{formData.cardName.toUpperCase() || "YOUR NAME"}
										</Text>
									</View>
									<View>
										<Text style={styles.cardDetailLabel}>EXPIRES</Text>
										<Text style={styles.cardDetailValue}>{formData.expiryDate || "MM/YY"}</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.formContainer}>
						{/* Card Number */}
						<SmoothBorderTextInput
							label="Card Number"
							placeholder="1234 5678 9012 3456"
							value={formData.cardNumber}
							onChangeText={(text) => handleChange("cardNumber", text)}
							labelColor={colors.Neutral500}
							valueColor={colors.Neutral700}
							isFocusBorderColor={colors.AuxColorTwo}
							isBlurBorderColor={colors.Neutral100}
							isBlurValueBorderColor={colors.SuccessfulNormal}
							isError={errors.cardNumber}
							errorMessage="Enter a valid card number"
							keyboardType="number-pad"
							maxLength={19} // 16 digits  3 spaces
							reduceMotion="never"
						/>

						{/* Row for Expiry and CVV */}
						<View style={styles.rowInputs}>
							<View style={styles.halfInput}>
								<SmoothBorderTextInput
									label="Expiry Date"
									placeholder="MM/YY"
									value={formData.expiryDate}
									onChangeText={(text) => handleChange("expiryDate", text)}
									labelColor={colors.Neutral500}
									valueColor={colors.Neutral700}
									isFocusBorderColor={colors.AuxColorThree}
									isBlurBorderColor={colors.Neutral100}
									isBlurValueBorderColor={colors.SuccessfulNormal}
									isError={errors.expiryDate}
									errorMessage="Invalid date"
									keyboardType="number-pad"
									maxLength={5} // MM/YY
									reduceMotion="never"
								/>
							</View>

							<View style={styles.halfInput}>
								<SmoothBorderTextInput
									label="CVV"
									placeholder="123"
									value={formData.cvv}
									onChangeText={(text) => handleChange("cvv", text)}
									labelColor={colors.Neutral500}
									valueColor={colors.Neutral700}
									isFocusBorderColor={colors.AuxColorThree}
									isBlurBorderColor={colors.Neutral100}
									isBlurValueBorderColor={colors.SuccessfulNormal}
									isError={errors.cvv}
									errorMessage="Invalid CVV"
									keyboardType="number-pad"
									maxLength={4}
									secureTextEntry
									reduceMotion="never"
								/>
							</View>
						</View>

						{/* Card Name */}
						<SmoothBorderTextInput
							label="Cardholder Name"
							placeholder="Name on card"
							value={formData.cardName}
							onChangeText={(text) => handleChange("cardName", text)}
							labelColor={colors.Neutral500}
							valueColor={colors.Neutral700}
							isFocusBorderColor={colors.PrimaryNormal}
							isBlurBorderColor={colors.Neutral100}
							isBlurValueBorderColor={colors.SuccessfulNormal}
							startIcon={
								<AntDesign name="user" size={18} style={{ left: 12, marginRight: 4 }} color={colors.Neutral300} />
							}
							isError={errors.cardName}
							errorMessage="Cardholder name is required"
							autoCapitalize="words"
						/>

						<TouchableOpacity
							style={[styles.payButton, { opacity: isLoading ? 0.5 : 1 }]}
							onPress={handleSubmit}
							activeOpacity={0.8}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color={colors.Neutral500} />
							) : (
								<Text style={styles.payButtonText}>Pay Now</Text>
							)}
						</TouchableOpacity>

						<View style={styles.securityNote}>
							<Ionicons name="lock-closed" size={16} color={colors.Neutral300} />
							<Text style={[styles.securityText, { color: colors.Neutral300 }]}>
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
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 6,
	},
	formTitle: {
		fontSize: 26,
		fontWeight: "700",
		marginBottom: 8,
	},
	formSubtitle: {
		fontSize: 15,
		lineHeight: 22,
	},
	cardIllustration: {
		alignItems: "center",
		marginVertical: 20,
	},
	cardPreview: {
		height: CARD_HEIGHT,
		padding: 24,
	},
	NumberPreview: {
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
		fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
		fontSize: 14,
		fontWeight: "500",
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
		fontSize: 13,
		marginLeft: 6,
	},
	cardPreviewContainer: {
		height: CARD_HEIGHT,
		borderRadius: 16,
		overflow: "hidden",
		backgroundColor: "#E0E0E0", // Fallback BG
	},
	cardNumberPreview: {
		color: "#FFFFFF",
		fontSize: 22,
		fontWeight: "500",
		letterSpacing: 3,
		fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
		textAlign: "left",
		marginVertical: "auto",
	},
	gradientBase: {
		...StyleSheet.absoluteFillObject, // Make them fill their parent Animated.View
		borderRadius: 16,
	},
	cardContentOverlay: {
		...StyleSheet.absoluteFillObject,
		padding: 20,
		justifyContent: "space-between",
		zIndex: 1,
	},
	cardHeaderTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

const Chip = () => (
	<Svg width={36} height={28} viewBox="0 0 36 28" fill="none">
		<Path
			d="M35.678 4.144l.01 19.358c0 2.283-1.864 4.154-4.129 4.154l-26.641.022c-2.287 0-4.151-1.87-4.151-4.144L.745 4.176c0-2.295 1.864-4.154 4.14-4.154L31.538 0a4.145 4.145 0 014.14 4.144z"
			fill="#F6C859"
		/>
		<Path
			d="M14.217 23.98a.383.383 0 01-.357-.217.41.41 0 01.173-.544c.585-.305 1.377-.87 1.843-1.838.585-1.24.433-2.588.184-2.708-.065-.033-.303.098-.455.174-.38.196-.91.468-1.518.25-.596-.207-.888-.74-1.03-1-.92-1.686-1.202-6.058-.238-8.233.325-.718.759-1.153 1.3-1.283.554-.13 1.009.098 1.367.293.292.153.444.218.541.163.38-.228.369-1.62-.162-2.718-.466-.98-1.257-1.545-1.843-1.838a.4.4 0 01-.173-.544.398.398 0 01.542-.174c.694.359 1.647 1.033 2.2 2.218.553 1.164.813 3.176-.152 3.763-.487.294-.954.055-1.322-.13-.282-.142-.553-.283-.813-.218-.357.087-.596.49-.748.816-.845 1.903-.596 6.036.206 7.515.141.25.304.522.585.62.271.098.532-.022.89-.207.357-.185.747-.38 1.17-.185.91.446.845 2.393.195 3.785-.564 1.185-1.507 1.86-2.2 2.218-.065.011-.13.022-.185.022z"
			fill="#7D662D"
		/>
		<Path
			d="M12.993 10.593H5.72a.4.4 0 01-.401-.403c0-.217.173-.402.39-.402h7.273a.4.4 0 01.4.402.385.385 0 01-.39.403zM12.993 17.9H5.72a.4.4 0 01-.401-.401.4.4 0 01.4-.403h7.274a.4.4 0 01.4.402.394.394 0 01-.4.403zM22.704 23.97a.356.356 0 01-.184-.044c-.694-.36-1.648-1.033-2.2-2.219-.662-1.392-.716-3.338.184-3.784.422-.207.823 0 1.17.174.369.184.629.304.89.206.303-.108.476-.424.584-.62.803-1.479 1.04-5.622.195-7.514-.151-.327-.39-.74-.747-.816a.409.409 0 01-.304-.49.416.416 0 01.488-.304c.542.13.975.555 1.3 1.272.976 2.175.694 6.558-.227 8.233-.141.261-.434.794-1.03 1-.607.218-1.138-.054-1.517-.25-.152-.076-.39-.195-.455-.174-.239.12-.401 1.468.195 2.708.466.98 1.257 1.545 1.842 1.838a.4.4 0 01.174.544.37.37 0 01-.358.24zM21.078 8.961a.397.397 0 01-.38-.272c-.866-2.61 1.16-4.622 1.811-4.948a.398.398 0 01.542.174.41.41 0 01-.173.544c-.293.152-2.157 1.75-1.42 3.97a.394.394 0 01-.26.51c-.033.022-.076.022-.12.022z"
			fill="#7D662D"
		/>
		<Path
			d="M31.19 10.582h-7.272a.4.4 0 01-.401-.403c0-.217.184-.402.401-.402h7.273a.4.4 0 01.4.402.408.408 0 01-.4.403zM31.19 17.88h-7.272a.4.4 0 01-.401-.403.4.4 0 01.401-.403h7.273a.4.4 0 01.4.403.394.394 0 01-.4.402z"
			fill="#7D662D"
		/>
	</Svg>
);

const VisaIcon = () => (
	<Svg width={57} height={18} viewBox="0 0 57 18" fill="none">
		<Path
			d="M52.94.947h-3.501c-1.095 0-1.919.305-2.385 1.381l-6.72 15.324h4.77s.79-2.056.953-2.49h5.81c.14.576.553 2.49.553 2.49h4.216L52.94.947zm-5.582 10.788c.369-.957 1.778-4.687 1.778-4.687s.39-.979.617-1.577l.304 1.436s.878 3.98 1.051 4.829h-3.75zM34.287 5.591c-.011.772.975 1.294 2.557 2.066 2.613 1.197 3.826 2.632 3.794 4.546-.022 3.47-3.121 5.71-7.88 5.71-2.037-.022-3.988-.435-5.05-.892l.639-3.741.574.26c1.485.62 2.46.882 4.27.882 1.301 0 2.7-.511 2.721-1.632.011-.74-.596-1.261-2.352-2.077-1.734-.794-4.01-2.131-3.977-4.524.021-3.24 3.186-5.525 7.663-5.525 1.755 0 3.175.37 4.064.707l-.618 3.611-.412-.185a8.642 8.642 0 00-3.403-.642c-1.767-.01-2.59.74-2.59 1.436zM27.686.958l-2.829 16.694h-4.53l.552-3.241.9-5.329L23.145.969l4.54-.01zM11.406 9.56C9.89 5.7 6.27 2.491.796 1.165L.848.828h7.035c.954.043 1.723.337 1.983 1.359l1.54 7.373z"
			fill="#fff"
		/>
		<Path
			d="M21.313.98L14.17 17.64H9.38L5.314 3.72c2.916 1.882 5.398 4.862 6.276 6.928l.476 1.73L16.511.98h4.802z"
			fill="#fff"
		/>
	</Svg>
);

const MastercardIcon = () => (
	<Svg width={46} height={28} viewBox="0 0 46 28" fill="none">
		<Path
			d="M13.658 27.325c7.543 0 13.658-6.114 13.658-13.657S21.2.01 13.658.01C6.115.01 0 6.125 0 13.668c0 7.543 6.115 13.657 13.658 13.657z"
			fill="#fff"
		/>
		<Path
			d="M31.878 27.315c-7.535 0-13.657-6.122-13.668-13.647C18.2 6.143 24.333.01 31.858 0c7.535 0 13.657 6.122 13.668 13.647.01 7.525-6.112 13.658-13.648 13.668zm-.01-22.762c-5.023 0-9.105 4.092-9.105 9.105 0 5.013 4.092 9.105 9.105 9.105 5.024 0 9.105-4.092 9.105-9.105 0-5.034-4.081-9.116-9.105-9.105z"
			fill="#fff"
		/>
	</Svg>
);

const AmexIcon = () => (
	<Svg width={59} height={15} viewBox="0 0 59 15" fill="none">
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.55 0L0 14.493h7.84l.973-2.31h2.221l.972 2.31h8.63V12.73l.77 1.763h4.464l.769-1.8v1.8h17.948l2.182-2.25 2.044 2.25 9.219.02-6.57-7.226L58.032 0h-9.076l-2.125 2.21L44.852 0H25.327L23.65 3.74 21.934 0H14.11v1.704L13.24 0H6.55zm26.802 2.058h10.306l3.153 3.405 3.254-3.405h3.152l-4.79 5.227 4.79 5.167h-3.295L46.77 9.007l-3.271 3.445H33.352V2.058zm2.545 4.052v-1.9h6.431l2.806 3.036-2.93 3.053h-6.307V8.226h5.623V6.11h-5.623zM8.067 2.058h3.821l4.344 9.828V2.058h4.187l3.355 7.047 3.093-7.047h4.166v10.4h-2.535l-.02-8.15-3.696 8.15h-2.268l-3.716-8.15v8.15h-5.214l-.989-2.331H7.254l-.986 2.33H3.474L8.066 2.057zm.099 5.913l1.76-4.153 1.757 4.153H8.166z"
			fill="#fff"
		/>
	</Svg>
);
