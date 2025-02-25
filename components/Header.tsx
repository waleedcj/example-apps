import React from "react";
import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
	Extrapolation,
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingSpinnerSVG from "./ui/LoadingSpinner";

export const HEADER_HEIGHT = 60;

type HeaderProps = {
	headerShown: SharedValue<number>;
};

export function Header({ headerShown }: HeaderProps) {
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						headerShown.value,
						[0, 1],
						[-HEADER_HEIGHT, 0],
						Extrapolation.CLAMP
					),
				},
			],
		};
	});

	const contentAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				headerShown.value,
				[0, 1],
				[0, 1],
				Extrapolation.CLAMP
			),
		};
	});

	return (
		<Animated.View
			style={[
				styles.header,
				headerAnimatedStyle,
				{ top: insets.top, backgroundColor: colors.Neutral50 },
			]}
		>
			<Animated.View style={[styles.headerContainer, contentAnimatedStyle]}>
				{/* Left Side: Profile Image and Username */}
				<View style={styles.profileSection}>
					<Image
						source={{ uri: "https://picsum.photos/100" }}
						style={styles.profileImage}
					/>
					<View style={styles.textContainer}>
						<Text style={[styles.usernameText, { color: colors.Neutral500 }]}>
							{"Guest"}
						</Text>
					</View>
				</View>

				{/* Right Side: Icons */}
				<View style={styles.iconContainer}>
					<TouchableOpacity onPress={() => {}} style={styles.iconButton}>
						<Ionicons
							name="search-outline"
							size={24}
							color={colors.Neutral500}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							// Handle language change
						}}
						style={styles.iconButton}
					>
						<Ionicons
							name="notifications-outline"
							size={24}
							color={colors.Neutral500}
						/>
					</TouchableOpacity>
					{/* <LoadingSpinnerSVG color={colors.Neutral500} /> */}
				</View>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		shadowRadius: 3,
		// elevation: 4,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		zIndex: 10,
		width: "100%",
		height: HEADER_HEIGHT,
	},
	profileSection: {
		flexDirection: "row",
		alignItems: "center",
	},
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 8,
	},
	textContainer: {
		alignItems: "flex-start",
	},
	usernameText: {
		color: "#000", // Default value; will be overridden by colors.Neutral900
		fontSize: 16, // Assumed from s2; adjust if needed
		fontWeight: "600",
	},
	buyerText: {
		color: "#000", // Default value; will be overridden by colors.Neutral900
		fontSize: 12, // Assumed from s4; adjust if needed
		fontWeight: "400",
	},
	iconContainer: {
		flexDirection: "row",
		// alignItems: "center",
	},
	iconButton: {
		marginLeft: 16,
	},
});
