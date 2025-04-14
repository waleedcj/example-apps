
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors'; // Adjust path

export function useAppColors() {
  const scheme = useColorScheme();
  // Return the entire color object based on the scheme
  return scheme === 'dark' ? Colors.dark : Colors.light;
}