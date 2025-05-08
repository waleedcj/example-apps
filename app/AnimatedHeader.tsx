import React from "react";
import { useAppColors } from "@/hooks/useAppColors";
import AnimatedHeaderDemo from "@/components/AnimatedHeaderDemo";

export default function AnimatedHeader() {
	const appColors = useAppColors();
	return (
		<AnimatedHeaderDemo />
	);
}