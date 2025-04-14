
// Create a file named theme.d.ts in your project root or src

import { Theme } from '@react-navigation/native';
// Adjust path to your Colors definition if necessary
// It doesn't need the actual values, just the keys for type checking
import { Colors } from "@/constants/Colors";

// Get the type of keys from one of the themes (light/dark)
// Assuming both have the same keys
type CustomColorKeys = keyof typeof Colors.light;

// Create a mapped type for the colors record
// Ensures all keys from your Colors object are typed as string
type CustomColors = {
  [key in CustomColorKeys]: typeof Colors.light[key] extends string[] ? string[] : string;
}

// Define extended theme type
interface ExtendedTheme extends Theme {
  colors: Theme['colors'] & CustomColors;
}

// Augment the module
declare module '@react-navigation/native' {
  export function useTheme(): ExtendedTheme;
  // You can also augment DefaultTheme and DarkTheme if needed
  // export const DefaultTheme: ExtendedTheme;
  // export const DarkTheme: ExtendedTheme;
}
