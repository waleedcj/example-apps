import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from '@/components/ThemedView';
import AnimatedHeaderDemo from "@/components/AnimatedHeaderDemo";
import { useTheme } from "@react-navigation/native";

export default function HomeScreen() {
  const { colors } = useTheme();

  return <AnimatedHeaderDemo />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
