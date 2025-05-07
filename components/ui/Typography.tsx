import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

// Define mappings for size and weight
const sizeMap = {
  'sm': 14,
  'base': 16,
  'lg': 18,
  'xl': 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 36,
};

const weightMap = {
  'regular': 'font-regular',
  'medium': 'font-medium',
};

type TypographyProps = {
  children: React.ReactNode;
  size?: keyof typeof sizeMap;
  weight?: keyof typeof weightMap;
  style?: StyleProp<TextStyle>;
} & React.ComponentProps<typeof Text>; // Inherit other Text props

export default function Typography({
  children,
  size = 'base',
  weight = 'regular',
  style,
  ...props
}: TypographyProps) {

  const textStyle: TextStyle = {
    fontSize: sizeMap[size],
    fontFamily: weightMap[weight],
  };

  return (
    <Text style={[styles.base, textStyle, style]} {...props}>
      {children}
    </Text>
  );
}

// Optional base styles if needed
const styles = StyleSheet.create({
  base: {
    // Add any base styles that should apply to all text, e.g., color
    // color: 'black',
  },
});