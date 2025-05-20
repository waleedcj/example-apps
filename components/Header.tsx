import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
	Extrapolation,
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppColors } from "@/hooks/useAppColors";

export const HEADER_HEIGHT = 60;

type HeaderProps = {
	headerShown: SharedValue<number>;
};

export function Header({ headerShown }: HeaderProps) {
	const  colors  = useAppColors();
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
				{ top: insets.top, backgroundColor: colors.Neutral0 },
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
					<TouchableOpacity style={styles.iconButton}>
						<Ionicons
							name="search-outline"
							size={24}
							color={colors.Neutral500}
						/>
					</TouchableOpacity>

					<TouchableOpacity style={styles.iconButton}>
						<Ionicons
							name="notifications-outline"
							size={24}
							color={colors.Neutral500}
						/>
					</TouchableOpacity>
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
		fontSize: 16,
		fontWeight: "600",
	},
	buyerText: {
		fontSize: 12,
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
