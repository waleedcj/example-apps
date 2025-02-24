import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Header } from "./Header";
import { useTheme } from "@react-navigation/native";

// Default data to scroll through
const defaultData = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

// Main Component with ScrollView and Animated Header
export default function AnimatedHeaderDemo() {
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerShown = useSharedValue(1);
  const { colors } = useTheme();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const dy = currentScrollY - lastScrollY.value; // Scroll direction and distance
      lastScrollY.value = currentScrollY;

      if (currentScrollY < 0) {
        // When bouncing at the top (negative scroll position), keep header shown
        headerShown.value = withSpring(1, { damping: 20, stiffness: 300, mass: 1 });
      } else {
        // For normal scrolling, adjust header based on scroll direction
        headerShown.value = withSpring(
          Math.min(Math.max(headerShown.value + -dy / 50, 0), 1),
          { damping: 20, stiffness: 300, mass: 1, }
        );
      }

      console.log(currentScrollY);
      scrollY.value = currentScrollY;
    },
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.Neutral50 }]}
    >
      <Header headerShown={headerShown} />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        // bounces={false}
        scrollEventThrottle={16}
      >
        {defaultData.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={[styles.text, { color: colors.Neutral700 }]}>
              {item}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    color: "black",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 50,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
  },
});
