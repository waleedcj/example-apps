import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import PieChartInsights, {
	PieChartDataItem,
} from "@/components/ui/PieChartInsights";
import { useAppColors } from "@/hooks/useAppColors";
import Skeleton from "@/components/ui/Skeleton";

// Example utility if you still have it and want to use it
const formatCompactNumberCustom = (value: number): string => {
	if (value > 9999) return `${(value / 1000).toFixed(1)}k`;
	return value.toString();
};

const MyInsightsPage = () => {
	const appColors = useAppColors();

	// Sample data for the pie chart
	// In a real app, this would come from your state or API transformation logic
	const chartData: PieChartDataItem[] = [
		{
			id: "interacting",
			label: "Interacting with Content",
			value: 15000,
			color: "#4A90E2",
		}, // Bright Blue
		{
			id: "creating",
			label: "Creating Content",
			value: 2500,
			color: "#50E3C2",
		}, // Teal
		{ id: "tasks", label: "Tasks Completed", value: 800, color: "#F5A623" }, // Orange
		{ id: "rewards", label: "Referral Rewards", value: 1200, color: "#BD10E0" }, // Purple
		{ id: "share", label: "Sharing Activity", value: 1800, color: "#7ED321" }, // Lime Green
		{
			id: "referral",
			label: "New User Referrals",
			value: 2200,
			color: "#D0021B",
		},
		// Add more items if needed
	];

	const chartDataEmpty: PieChartDataItem[] = [
		{ id: "interacting", label: "Interacting", value: 0, color: "#4A90E2" },
		{ id: "creating", label: "Creating", value: 0, color: "#50E3C2" },
	];

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={screenStyles.container}>
				<Text style={[screenStyles.header, { color: appColors.Neutral900 }]}>
					My Activity Insights
				</Text>
				<Skeleton
					isLoading={false}
					style={screenStyles.skeleton}
					reduceMotion="never"
				>
					<PieChartInsights
						title="Yesterday's Earned Points"
						data={chartData}
						valueSuffix=" Points"
						formatValue={formatCompactNumberCustom}
						containerStyle={{
							backgroundColor: appColors.Neutral50,
							marginVertical: 20,
							width: "90%",
						}}
						titleStyle={{ color: appColors.Neutral900, fontSize: 20 }}
						centerValueStyle={{
							color: appColors.Neutral900,
							fontSize: 30,
							fontWeight: "600",
						}}
						centerTotalLabelStyle={{
							color: appColors.Neutral500,
							fontSize: 12,
							fontWeight: "400",
						}}
						pieBaseColor={appColors.Neutral90}
						emptyPieColor={appColors.Neutral100}
						legendItemLabelStyle={{ fontSize: 13 }}
						legendItemValueStyle={{ fontWeight: "600" }}
					/>
				</Skeleton>
				<Text
					style={[
						screenStyles.header,
						{ color: appColors.Neutral900, marginTop: 20 },
					]}
				>
					Empty Chart Example
				</Text>
				<PieChartInsights
					title="No Activity Yet"
					data={chartDataEmpty}
					valueSuffix=" Points"
					containerStyle={{
						backgroundColor: appColors.Neutral50,
						marginVertical: 20,
						width: "90%",
					}}
					titleStyle={{ color: appColors.Neutral900 }}
				/>

				<Text
					style={[
						screenStyles.header,
						{ color: appColors.Neutral900, marginTop: 20 },
					]}
				>
					Chart with fewer items
				</Text>
				<PieChartInsights
					title="Simple Breakdown"
					data={chartData.slice(0, 2)} // Only first two items
					valueSuffix=" USD"
					containerStyle={{
						backgroundColor: appColors.Neutral50,
						marginVertical: 20,
						width: "90%",
					}}
					titleStyle={{ color: appColors.Neutral900 }}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

const screenStyles = StyleSheet.create({
	container: {
		padding: 16,
		alignItems: "center",
	},
	header: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
	},
	skeleton: {
		height: 400,
		width: "90%",
		borderRadius: 4,
		marginBottom: 8,
	},
});

export default MyInsightsPage;
