import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, ...Colors.dark },
  };
  const CustomLightTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, ...Colors.light },
  };
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="radialBackground"  options={{ headerShown: false }} />
            <Stack.Screen name="AnimatedHeader" options={{ headerShown: false }} />
            <Stack.Screen name="TabBarPage" options={{ headerShown: false }} />
            <Stack.Screen name="SkeletonPage" options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingPage" options={{ headerShown: false }} />
            <Stack.Screen name="ImageCarouselPage" options={{ headerShown: false }} />
            <Stack.Screen name="SwipeSliderPage" options={{ headerShown: false }} />
            <Stack.Screen name="ProgressCirclePage" options={{ headerShown: false }} />
            <Stack.Screen name="OtpPage" options={{ headerShown: false }} />
            <Stack.Screen name="MyInsightsPage" options={{ headerShown: false }} />
            <Stack.Screen name="TransitioningProgressCirclePage" options={{ headerShown: false }} />
            <Stack.Screen name="SearchBarPage" options={{ headerShown: false }} />
            <Stack.Screen name="ProgressBarPage" options={{ headerShown: false }} />
            <Stack.Screen name="DropdownPickerPage" options={{ headerShown: false }} />  
            <Stack.Screen name="ButtonsPage" options={{ headerShown: false }} /> 
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
