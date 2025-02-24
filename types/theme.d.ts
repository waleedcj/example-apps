import { Theme } from '@react-navigation/native'
import { Colors } from "@/constants/Colors";

// Define extended theme type that literally *extends* Theme
interface ExtendedTheme extends Theme {
  // Reference the Theme type's colors field and make our field an intersection
  // Learn more:
  //   https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
  //   https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
  colors: Theme['colors'] & {
    PrimaryNormal: string;
      PrimaryDisable: string;
      PrimaryLightBackground: string;
      PrimaryGradient: string[];
      AuxColorTwo: string;
      AuxColorThree: string;
      Neutral900: string;
      Neutral700: string;
      Neutral500: string;
      Neutral300: string;
      Neutral100: string;
      Neutral90: string;
      Neutral70: string;
      Neutral50: string;
      Neutral0: string;
      SuccessfulNormal: string;
      SuccessfulDisable: string;
      SuccessfulLightBackground: string;
      ErrorNormal: string;
      ErrorDisable: string;
      ErrorLightBackground: string;
      WarningNormal: string;
      WarningDisable: string;
      WarningLightBackground: string;
      bgColor: string;
      ToastBGColor: string;
      DetailIconColor: string;
      TabBarBg: string;
      ModalBg: string;
      borderColorGrey: string;
  }
}

// export const lightTheme: ExtendedTheme = {
//   dark: false,
//   colors: {
//     ...Colors.light
//   }
// }


// export const darkTheme: ExtendedTheme = {
//   dark: true,
//   colors: {
//     ...Colors.dark
//   }
// }

declare module '@react-navigation/native' {
  export function useTheme(): ExtendedTheme
}