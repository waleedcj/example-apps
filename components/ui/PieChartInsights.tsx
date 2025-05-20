import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

export type PieChartDataItem = {
  id: string | number; // Unique key for mapping
  label: string;       // Label for the legend
  value: number;       // Numerical value for the slice
  color: string;       // Color for the slice and legend marker
};

type svgTextStyle = {
    fontSize: number;
    color: string;
    fontWeight: string;
}

type PieChartInsightsProps = {
  data: PieChartDataItem[];
  title?: string;
  size?: number;          // SVG canvas size
  strokeWidth?: number;   // Thickness of the pie chart arcs
  totalLabel?: string;    // Label for the total value in the center (e.g., "Total")
  valueSuffix?: string;   // Suffix for values (e.g., " USD", " Points")
  formatValue?: (value: number) => string; // Function to format numerical values for display

  // Styling Props
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  centerSectionStyle?: StyleProp<ViewStyle>; // Style for the View containing center text and pie
  centerValueStyle?: svgTextStyle;
  centerTotalLabelStyle?: svgTextStyle;
  pieBaseColor?: string; // Background color of the full circle behind segments
  emptyPieColor?: string; // Color of the pie when all values are zero or data is empty

  legendContainerStyle?: StyleProp<ViewStyle>;
  legendColumnStyle?: StyleProp<ViewStyle>; // Style for each column in the legend
  legendItemContainerStyle?: StyleProp<ViewStyle>; // Style for an individual legend item's wrapping view
  legendItemDetailsStyle?: StyleProp<ViewStyle>; // Style for the view containing text part of legend item
  legendItemLabelStyle?: StyleProp<TextStyle>;
  legendItemValueStyle?: StyleProp<TextStyle>; // For "formattedValue Suffix"
  legendItemPercentageStyle?: StyleProp<TextStyle>;
  //additionally you could add your loading state here if you want to make sure data is loaded but that is better done in the parent

};

const DefaultFormatValue = (value: number): string => {
  if (value === undefined || value === null) return '0';
  // Simple compact number formatter as a default
  if (Math.abs(value) >= 1.0e9) {
    return (Math.abs(value) / 1.0e9).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (Math.abs(value) >= 1.0e6) {
    return (Math.abs(value) / 1.0e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(value) >= 1.0e3) {
    return (Math.abs(value) / 1.0e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return value.toLocaleString();
};

const PieChartInsights: React.FC<PieChartInsightsProps> = ({
  data,
  title,
  size = 240,
  strokeWidth = 30,
  totalLabel = 'Total',
  valueSuffix = '',
  formatValue = DefaultFormatValue,
  containerStyle,
  titleStyle,
  centerSectionStyle,
  centerValueStyle,
  centerTotalLabelStyle,
  pieBaseColor = '#F0F0F0', // Light gray for base
  emptyPieColor = '#E0E0E0', // Slightly different gray for empty state
  legendContainerStyle,
  legendColumnStyle,
  legendItemContainerStyle,
  legendItemDetailsStyle,
  legendItemLabelStyle,
  legendItemValueStyle,
  legendItemPercentageStyle,
}) => {
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2; // Adjust radius to account for stroke width center
  const circumference = 2 * Math.PI * radius;

  const totalValue = React.useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const allValuesZero = totalValue === 0;

  const calculateStrokeDashArray = (
    itemValue: number,
    currentTotal: number,
    circ: number
  ) => {
    if (currentTotal === 0) return `0 ${circ}`; // No stroke if total is zero
    const stroke = (itemValue / currentTotal) * circ;
    return `${stroke} ${circ - stroke}`;
  };

  const calculateStrokeDashOffset = (
    cumulativeValue: number,
    currentTotal: number,
    circ: number
  ) => {
    if (currentTotal === 0) return 0;
    return -( (cumulativeValue / currentTotal) * circ );
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number): string => {
    const startRad = (startAngle - 90) * Math.PI / 180; // Subtract 90 to start from top
    const endRad = (endAngle - 90) * Math.PI / 180;

    const startX = x + r * Math.cos(startRad);
    const startY = y + r * Math.sin(startRad);
    const endX = x + r * Math.cos(endRad);
    const endY = y + r * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M', startX, startY,
      'A', r, r, 0, largeArcFlag, 1, endX, endY,
    ].join(' ');

    return d;
  };

  let cumulativePercentage = 0;

  // For legend layout (2 columns)
  const midPoint = Math.ceil(data.length / 2);
  const legendColumn1 = data.slice(0, midPoint);
  const legendColumn2 = data.slice(midPoint);

  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      {title && <Text style={[styles.defaultTitle, titleStyle]}>{title}</Text>}

      <View style={[styles.defaultCenterSection, centerSectionStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Base circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={allValuesZero ? emptyPieColor : pieBaseColor}
            strokeWidth={strokeWidth}
          />

          {/* Data segments */}
          {!allValuesZero &&
            data.map((item) => {
              const strokeDasharray = calculateStrokeDashArray(
                item.value,
                totalValue,
                circumference
              );
              const strokeDashoffset = calculateStrokeDashOffset(
                cumulativePercentage,
                totalValue,
                circumference
              );
              cumulativePercentage += item.value; // Update for next segment

              return (
                <Circle
                  key={item.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt" 
                />
              );
            })}

          {/* Center Text */}
          <SvgText
            x={center}
            y={center - (centerValueStyle?.fontSize || styles.defaultCenterTotalLabel.fontSize || 16) / 2} // Adjust y based on font size
            fill={ centerValueStyle?.color || styles.defaultCenterValue.color}
            fontSize={centerValueStyle?.fontSize || styles.defaultCenterValue.fontSize}
            fontWeight={centerValueStyle?.fontWeight || styles.defaultCenterValue.fontWeight}
            textAnchor="middle"

          >
            {formatValue(totalValue)}
          </SvgText>
          <SvgText
            x={center}
            y={center + ( centerTotalLabelStyle?.fontSize || styles.defaultCenterValue.fontSize) / 2} // Adjust y based on font size
            fill={ centerTotalLabelStyle?.color || styles.defaultCenterTotalLabel.color}
            fontSize={ centerTotalLabelStyle?.fontSize || styles.defaultCenterTotalLabel.fontSize}
            fontWeight={ centerTotalLabelStyle?.fontWeight || styles.defaultCenterTotalLabel.fontWeight}
            textAnchor="middle"
          >
            {totalLabel}
          </SvgText>
        </Svg>
      </View>

      {data.length > 0 && (
        <View style={[styles.defaultLegendContainer, legendContainerStyle]}>
          {[legendColumn1, legendColumn2].map((column, colIndex) =>
            column.length > 0 ? ( // Render column only if it has items
              <View key={`legend-col-${colIndex}`} style={[styles.defaultLegendColumn, legendColumnStyle]}>
                {column.map((item) => {
                  const percentage = allValuesZero ? 0 : (item.value / totalValue) * 100;
                  return (
                    <View
                      key={`legend-${item.id}`}
                      style={[styles.defaultLegendItemContainer, legendItemContainerStyle]}
                    >
                      <View style={[styles.defaultLegendItemDetails, legendItemDetailsStyle]}>
                        <Text style={[styles.defaultLegendItemLabel, legendItemLabelStyle, { color: item.color }]}>
                          {item.label}
                        </Text>
                        <Text style={[styles.defaultLegendItemValue, legendItemValueStyle, { color: item.color }]}>
                          {`${formatValue(item.value)}${valueSuffix}`}
                        </Text>
                        <Text style={[styles.defaultLegendItemPercentage, legendItemPercentageStyle, { color: item.color }]}>
                          {`${percentage.toFixed(2)}%`}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  defaultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  defaultCenterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  defaultCenterValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  defaultCenterTotalLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  defaultLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  defaultLegendColumn: {
    flex: 1,
  },
  defaultLegendItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  defaultLegendItemDetails: {
    flex: 1,
  },
  defaultLegendItemLabel: {
    fontSize: 12,
    fontWeight: '400',
    // color applied dynamically
  },
  defaultLegendItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  defaultLegendItemPercentage: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default PieChartInsights;