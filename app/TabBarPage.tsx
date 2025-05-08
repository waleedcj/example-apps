import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import AnimatedTabs from "@/components/ui/LineTabBar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppColors } from "@/hooks/useAppColors";

// Example Content Components you can import you own views here
const FeaturedContent = () => (
	<View style={styles.content}>
		<Text style={styles.contentText}>Featured Content Area</Text>
	</View>
);
const TopGainersContent = () => (
	<View style={styles.content}>
		<Text style={styles.contentText}>Top Gainers Content Area</Text>
	</View>
);
const TopLosersContent = () => {
	return (
		<View style={styles.content}>
			<Text style={styles.contentText}>Top Losers Content Area</Text>
		</View>
	);
};
export default function TabBarPage() {
	const appColors = useAppColors();
	const tabData = [
		{
			id: "featured",
			title: "Featured",
			icon: <AntDesign name="staro" size={18} color={appColors.Neutral300} />,
			content: <FeaturedContent />,
		},
		{
			id: "gainers",
			title: "Top Gainers",
			icon: <AntDesign name="rocket1" size={18} color={appColors.Neutral300} />,
			content: <TopGainersContent />,
		},
		{
			id: "losers",
			title: "Top Losers",
			icon: <AntDesign name="flag" size={18} color={appColors.Neutral300} />,
			content: <TopLosersContent />,
		},
	];

	return (
		<SafeAreaView style={styles.container}>
			<AnimatedTabs
				tabs={tabData}
				reduceMotion="never"
        //uncomment this too make the tab look like a moving button
				// indicatorStyle={{ height: "100%", zIndex: -1, borderRadius: 16 }}
				// headerContainerStyle={{ borderBottomWidth: 0 }}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
	},
	content: {
		// Example style for content views
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	contentText: {
		color: "white",
		fontSize: 18,
	},
});
