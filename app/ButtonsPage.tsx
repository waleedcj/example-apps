import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import { useAppColors } from "@/hooks/useAppColors";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons/";
import {
	SmoothBackgroundButton,
	ScaleAnimatedButton,
	ShadowAnimatedButton,
	ThreeDimensionAnimatedButton,
	IconAnimatedButton,
	StepAnimatedButton,
	GradientButton,
	PulseAnimatedButton,
} from "@/components/ui/Buttons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ButtonsPage() {
	const colors = useAppColors();
	const [isLoading, setIsLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	const toggleLoading = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1500);
	};

	const downloadAction = () => {
		if (currentStep === 0) {
			setCurrentStep(1);
			setTimeout(() => setCurrentStep(2), 2000);
		} else {
			setCurrentStep(0);
		}
	};

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgColor }]}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContainer}>
				<Text style={[styles.pageTitle, { color: colors.Neutral900 }]}>Buttons</Text>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Pulse Animated Button</Text>
					<PulseAnimatedButton
						buttonColor={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						buttonTouchColor={colors.AuxColorThree}
						onPress={() => {}}
						title="Pulse Action"
						reduceMotion="never"
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Shadow Animated Button</Text>
					<ShadowAnimatedButton
						buttonColor={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						buttonShadowColor={colors.AuxColorThree}
                        onPress={() => {}}
						title="Shadow Action"
						reduceMotion="never"
						Icon={<MaterialCommunityIcons name="biohazard" size={18} color={colors.Neutral0} />}
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Icon Animated Button</Text>
					<IconAnimatedButton
						buttonColor={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						onPress={() => {}}
						title="Icon Action"
						reduceMotion="never"
						Icon={<MaterialCommunityIcons name="airplane-takeoff" size={18} color={colors.Neutral0} />}
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Smooth Background Button</Text>
					<SmoothBackgroundButton
						buttonColor={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						buttonTouchColor={colors.AuxColorThree}
						onPress={toggleLoading}
						isLoading={isLoading}
						title={"Smooth Action"}
						reduceMotion="never"
						Icon={<MaterialCommunityIcons name="balloon" size={18} color={colors.Neutral0} />}
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Scale Animated Button</Text>
					<ScaleAnimatedButton
						buttonColor={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						onPress={() => {}}
						title={"Scale Action"}
						reduceMotion="never"
						Icon={<MaterialIcons name="payment" size={18} color={colors.Neutral0} />}
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>3D Animated Button</Text>
					<ThreeDimensionAnimatedButton
						buttonColor={colors.PrimaryNormal}
						textColor={colors.Neutral0}
						buttonShadowColor={colors.PrimaryDisable}
						onPress={() => {}}
						title="3D Action"
						reduceMotion="never"
						Icon={<MaterialCommunityIcons name="human" size={18} color={colors.Neutral0} />}
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Gradient Button</Text>
					<GradientButton
						buttonColorOne={colors.AuxColorThree}
						buttonColorTwo={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						onPress={() => {}}
						title="Gradient Action"
					/>
				</View>

				<View style={styles.buttonEntry}>
					<Text style={[styles.buttonTitleText, { color: colors.Neutral700 }]}>Step Animated Button</Text>
					<StepAnimatedButton
						buttonColor={colors.AuxColorTwo}
						textColor={colors.Neutral0}
						buttonTouchColor={colors.AuxColorThree}
						currentStep={currentStep}
						reduceMotion="never"
						onPress={downloadAction}
						steps={[
							{
								Icon: <MaterialCommunityIcons accessible={false} color={colors.Neutral0} name="download" size={18} />,
								title: "Download",
							},
							{
								Icon: (
									<MaterialCommunityIcons
										accessible={false}
										color={colors.Neutral0}
										name="progress-download"
										size={18}
									/>
								),
								title: "Downloading...",
							},
							{
								Icon: <MaterialCommunityIcons accessible={false} color={colors.Neutral0} name="check" size={18} />,
								title: "Downloaded",
							},
						]}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollViewContainer: {
		paddingVertical: 24,
		paddingHorizontal: 16,
	},
	pageTitle: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 24, 
	},
	buttonEntry: {
		marginBottom: 32, 
		// alignItems: "center", 
	},
	buttonTitleText: {
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 8, 
		textAlign: "center",
	},
});
