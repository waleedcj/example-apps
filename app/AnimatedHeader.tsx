import React from "react";
import { useAppColors } from "@/hooks/useAppColors";
import AnimatedHeaderDemo from "@/components/AnimatedHeaderDemo";

export default function AnimatedHeader() {
	const appColors = useAppColors();
	return (
		<AnimatedHeaderDemo />
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 		paddingVertical: 16,
// 	},
// 	content: {
// 		width: "100%",
// 	},
// 	image: {
// 		width: 64,
// 		height: 64,
// 	},
// });
