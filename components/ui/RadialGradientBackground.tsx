import React, { ReactNode } from "react";
import {
	StyleSheet,
	View,
	StyleProp,
	ViewStyle,
	Dimensions,
} from "react-native";
import Svg, {
	Defs,
	RadialGradient,
	Stop,
	Ellipse,
} from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type RadialGradientBackgroundProps = {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	radiusFraction?: number; //how big you want the circle to be
	startColor: string;
	middleColor: string;
	endColor: string;
};

const RadialGradientBackground: React.FC<RadialGradientBackgroundProps> = ({
	children,
	style,
	radiusFraction = 0.5,
	startColor,
	middleColor,
	endColor,
}) => {
	// Calculate ellipse properties
	const cx = screenWidth / 2;
	const cy = screenHeight / 4;
	const ellipseRadius = Math.min(screenWidth, screenHeight) * radiusFraction;
	const ellipseDiameter = ellipseRadius * 2;

	// Calculate position for the content container to overlay the ellipse
	const contentTop = cy - ellipseRadius;
	const contentLeft = cx - ellipseRadius;

	return (
		<View style={[styles.container, style]}>
			{/* SVG container */}
			<Svg height={screenHeight} width={screenWidth} style={styles.svg}>
				<Defs>
					<RadialGradient
						id="gradient"
						cx={cx.toString()}
						cy={cy.toString()}
						rx={ellipseRadius.toString()}
						ry={ellipseRadius.toString()}
						gradientUnits="userSpaceOnUse"
					>
                        {/* you can customize the offset and opacity to your liking */}
						<Stop stopColor={startColor} stopOpacity={0.5} />
						<Stop offset={0.4} stopColor={middleColor} stopOpacity={0.4} />
						<Stop offset={1} stopColor={endColor} stopOpacity={0.25} />
					</RadialGradient>
				</Defs>
				<Ellipse
					cx={cx.toString()}
					cy={cy.toString()}
					rx={ellipseRadius.toString()}
					ry={ellipseRadius.toString()}
					fill={`url(#gradient)`}
				/>
			</Svg>

			{children && (
				<View
					style={[
						styles.contentContainer,
						{
							top: contentTop,
							left: contentLeft,
							width: ellipseDiameter,
							height: ellipseDiameter,
						},
					]}
				>
					{children}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},
	svg: {
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 0,
	},
	contentContainer: {
		position: "absolute",
		zIndex: 1,
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default RadialGradientBackground;
