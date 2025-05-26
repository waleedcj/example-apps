// app/showcase.tsx (or app/index.tsx, or wherever you want this main navigation page)
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useAppColors } from '@/hooks/useAppColors'; // Assuming you have this
import { Ionicons } from '@expo/vector-icons'; // For list item icons
const favicon = require("@/assets/images/favicon.png");

// Define the structure for our route items
type ShowcaseRoute = {
  key: string; // Unique key for FlatList
  name: string; // Display name for the route
  path: string; // Actual path for Expo Router (e.g., '/radialBackground')
  icon?: keyof typeof Ionicons.glyphMap; // Optional icon
  description?: string; // Optional short description
}

// List of all your component showcase routes
const showcaseRoutes: ShowcaseRoute[] = [
  { key: 'radialBg', name: "Radial Background", path: "/radialBackground", description: "Animated radial gradient background." },
  { key: 'animHeader', name: "Animated Header", path: "/AnimatedHeader", description: "Header that animates on scroll." },
  { key: 'tabBar', name: "Custom TabBar", path: "/TabBarPage", description: "Custom animated tab bar." },
  { key: 'skeleton', name: "Skeleton Loaders", path: "/SkeletonPage", description: "Shimmering placeholder UI." },
  { key: 'onboarding', name: "Onboarding Flow", path: "/OnboardingPage", description: "Multi-step onboarding sequence." },
  { key: 'imgCarousel', name: "Image Carousel", path: "/ImageCarouselPage", description: "Swipeable image gallery." },
  { key: 'swipeSlider', name: "Swipe Slider", path: "/SwipeSliderPage",  description: "Interactive swipeable slider." },
  { key: 'progressCircle', name: "Progress Circle", path: "/ProgressCirclePage", description: "Circular progress indicator." },
  { key: 'otpInput', name: "OTP Input", path: "/OtpPage", description: "One-Time Password input field." },
  { key: 'pieInsights', name: "Pie Chart Insights", path: "/MyInsightsPage", description: "Data visualization with pie charts." },
  { key: 'transProgress', name: "Transitioning Progress Circle", path: "/TransitioningProgressCirclePage", description: "Progress circle with state transitions." },
  { key: 'searchBar', name: "All In One Search Bar", path: "/SearchBarPage", description: "Recent searches and debounce search" },
  { key: 'progressBar', name: "Animated Progress Bar", path: "/ProgressBarPage",  description: "Linear progress bar with icon/text." },
  { key: 'dropdown', name: "Dropdown Picker", path: "/DropdownPickerPage", description: "Custom dropdown select component." },
  { key: 'buttons', name: "Button Collection", path: "/ButtonsPage", description: "Showcase of various button styles." },
];


export default function Demo() {
  const colors = useAppColors();

  const navigateToScreen = (path: string) => {
    router.push(path as any); // Type assertion if path isn't strictly typed for router.push
  };

  const renderRouteItem = ({ item }: { item: ShowcaseRoute }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: colors.bgColor, borderBottomColor: colors.Neutral90 }]}
      onPress={() => navigateToScreen(item.path)}
    >
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemName, { color: colors.Neutral900 }]}>{item.name}</Text>
        {item.description && (
            <Text style={[styles.itemDescription, { color: colors.Neutral500 }]}>{item.description}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward-outline" size={22} color={colors.Neutral300} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea,]}>
      <View style={styles.headerContainer}>
      <Image source={favicon} style={styles.image} resizeMode="cover" />
        <Text style={[styles.pageTitle, { color: colors.Neutral900 }]}>Demo</Text>
      </View>
           <Text style={[styles.pageSubtitle, { color: colors.Neutral500 }]}>Tap an item to view the component demo.</Text>
      <FlatList
        data={showcaseRoutes}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop:  10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    // borderBottomColor is set dynamically
  },
  image: {
		width: 32,
		height: 32,
	},
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    paddingBottom: 20,
  },
  listContentContainer: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 4, // Small gap between items
    marginHorizontal: 16, // Overall horizontal margin for the list items
    borderRadius: 10,
    // backgroundColor and borderBottomColor set dynamically
    // Shadow for a card-like feel
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemIconContainer: {
    marginRight: 18,
    padding: 8,
    borderRadius: 8,
    // backgroundColor: colors.PrimaryLightBackground // Could add a light background for icon
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
    marginTop: 2,
  },
});