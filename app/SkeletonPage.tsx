import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import Skeleton from "@/components/ui/Skeleton";
import { useAppColors } from "@/hooks/useAppColors";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_SIZE = 50;

export default function SkeletonPage() {
	const [isLoading, setIsLoading] = useState(true);
	const colors = useAppColors();

	useEffect(() => {
		// Simulate data fetching only if currently loading replace with your own promise
		if (isLoading) {
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 3500);

			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	const triggerReload = () => {
		setIsLoading(true);
	};

	// const baseColor = colors.Neutral50;
	// const shimmerColor = colors.Neutral70;

	const avatarUrl = "https://picsum.photos/100";
	const name = "Walid Memon";
	const description = "Software Developer | React Native Enthusiast";

	return (
		<SafeAreaView style={styles.screen}>
			{/* Avatar Skeleton/Image */}
			<View style={[styles.itemContainer]}>
				{/* width and height of the skeleton must be specified */}
				<Skeleton
					isLoading={isLoading}
					style={styles.skeletonAvatar}
					baseColor={colors.Neutral50}
					shimmerColor={colors.Neutral70}
				>
					<Image source={{ uri: avatarUrl }} style={styles.actualAvatar} />
				</Skeleton>

				{/* Text Lines Container */}
				<View style={styles.textContainer}>
					{/* Name Skeleton/Text */}
					<Skeleton
						isLoading={isLoading}
						style={styles.skeletonLineLong}
						reduceMotion="never"
						baseColor={colors.Neutral50}
						shimmerColor={colors.Neutral70}
					>
						<Text style={[styles.nameText, { color: colors.Neutral900 }]} numberOfLines={1}>
							{name}
						</Text>
					</Skeleton>

					{/* Description Skeleton/Text */}
					<Skeleton
						isLoading={isLoading}
						style={styles.skeletonLineShort}
						reduceMotion="never"
						baseColor={colors.Neutral50}
						shimmerColor={colors.Neutral70}
					>
						<Text style={[styles.descriptionText, { color: colors.Neutral500 }]} numberOfLines={1}>
							{description}
						</Text>
					</Skeleton>
				</View>
			</View>
			<Button title={"Reload Animation"} onPress={triggerReload} disabled={isLoading} color={colors.PrimaryNormal} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingTop: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	skeletonAvatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
	},
	skeletonLineLong: {
		height: 18,
		width: "95%",
		borderRadius: 4,
		marginBottom: 8,
	},
	skeletonLineShort: {
		height: 14,
		width: "75%", // Shorter line
		borderRadius: 4,
	},
	actualAvatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
	},
	nameText: {
		fontSize: 16,
		fontWeight: "600",
		lineHeight: 18,
		marginBottom: 8,
	},
	descriptionText: {
		fontSize: 12,
		lineHeight: 14,
	},
});
