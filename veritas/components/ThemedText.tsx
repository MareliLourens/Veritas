import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFonts } from 'expo-font';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'minititle';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const [fontsLoaded] = useFonts({
    FuturaPTBook: require('../assets/fonts/FuturaPTBook.otf'),
    FuturaPTBold: require('../assets/fonts/FuturaPTBold.otf'),
    MontserratReg: require('../assets/fonts/Montserrat-Regular.ttf'),
  });

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'minititle' ? styles.minititle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: 'FuturaPTBook',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'FuturaPTBook',
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: 'bold',
    fontFamily: 'FuturaPTBold',
  },
  minititle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'FuturaPTBold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'MontserratReg',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'FuturaPTBook',
  },
});
