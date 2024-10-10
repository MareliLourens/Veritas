import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor'; // Custom hook to determine theme-based colors (light or dark mode)
import { useFonts } from 'expo-font'; // Expo hook to load custom fonts from assets

// Define the custom type for ThemedText props, extending from React Native's TextProps
// It includes optional colors (lightColor, darkColor) and a 'type' prop to define text styles
export type ThemedTextProps = TextProps & {
  lightColor?: string; // Optional color for light mode
  darkColor?: string;  // Optional color for dark mode
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'minititle'; // Different text style types
};

// ThemedText component definition
export function ThemedText({
  style,           // Custom styles passed as props
  lightColor,      // Light mode color (optional)
  darkColor,       // Dark mode color (optional)
  type = 'default',// Default text type
  ...rest          // Spread operator to include other props (e.g., children, onPress, etc.)
}: ThemedTextProps) {
  
  // Get the appropriate color based on the theme (light or dark mode) using the custom useThemeColor hook
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Load custom fonts using the Expo useFonts hook
  const [fontsLoaded] = useFonts({
    // Load the fonts from the assets/fonts folder
    FuturaPTBook: require('../assets/fonts/FuturaPTBook.otf'),  // Futura PT Book font
    FuturaPTBold: require('../assets/fonts/FuturaPTBold.otf'),  // Futura PT Bold font
    MontserratReg: require('../assets/fonts/Montserrat-Regular.ttf'),  // Montserrat Regular font
  });

  // console.log("Fonts loaded:", fontsLoaded);  // (optional) Check if fonts are loaded

  // Render the Text component with dynamic styling based on props
  return (
    <Text
      style={[
        { color }, // Apply the determined color
        type === 'default' ? styles.default : undefined,         // Apply default style if type is 'default'
        type === 'title' ? styles.title : undefined,             // Apply title style if type is 'title'
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined, // Apply semi-bold default style
        type === 'subtitle' ? styles.subtitle : undefined,       // Apply subtitle style if type is 'subtitle'
        type === 'link' ? styles.link : undefined,               // Apply link style if type is 'link'
        type === 'minititle' ? styles.minititle : undefined,     // Apply minititle style
        style,                                                   // Apply any custom styles passed through props
      ]}
      {...rest} // Spread the remaining props (e.g., text content, event handlers, etc.)
    />
  );
}

// Define the styles for each text type using StyleSheet.create
const styles = StyleSheet.create({
  default: {
    fontSize: 16,             // Default font size
    fontFamily: 'FuturaPTBook', // Default font family (Futura PT Book)
  },
  defaultSemiBold: {
    fontSize: 16,             // Font size for semi-bold text
    lineHeight: 24,           // Line height for readability
    fontWeight: '600',        // Semi-bold weight
    fontFamily: 'FuturaPTBook', // Font family (Futura PT Book)
  },
  title: {
    fontSize: 32,             // Larger font size for titles
    lineHeight: 32,     // Line height for titles
    fontWeight: 'bold',      
    fontFamily: 'FuturaPTBold', // Bold version of the Futura font (not loaded in the hook, missing in assets)
  },
  minititle: {
    fontSize: 16, // Smaller title size
    fontWeight: 'bold',             
    fontFamily: 'FuturaPTBold', // Bold version for minititle
  },
  subtitle: {
    fontSize: 16,             // Font size for subtitles
    fontFamily: 'MontserratReg', // Use Montserrat Regular font
  },
  link: {
    lineHeight: 30,           // Line height for links
    fontSize: 16,             // Font size for links
    color: '#0a7ea4',         // Specific color for links (light blue)
    fontFamily: 'FuturaPTBook', // Font family for links (Futura PT Book)
  },
});
