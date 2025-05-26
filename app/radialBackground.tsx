import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import RadialGradientBackground from "@/components/ui/RadialGradientBackground";
import { useAppColors } from "@/hooks/useAppColors";
import { SafeAreaView } from "react-native-safe-area-context";
const outlineIcon = require("@/assets/images/favicon.png");

export default function radialBackground() {
	const appColors = useAppColors();
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<RadialGradientBackground
					startColor={appColors.Neutral900}
					middleColor={appColors.Neutral500}
					endColor={appColors.Neutral0} //this should be you bg color
				>
                    {/* you can add anything here it will be in the center of the radical background */}
					<Image
						source={outlineIcon}
						style={styles.image}
						resizeMode="contain"
					/>
				</RadialGradientBackground>
				
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
	},
	content: {
		width: "100%",
	},
	image: {
		width: 64,
		height: 64,
	},
});
