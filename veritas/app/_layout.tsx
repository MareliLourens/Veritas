import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth'; // Firebase authentication listener
import { auth } from './firebase'; // Importing Firebase authentication instance from firebase config
import { Image } from 'react-native';
import LoginScreen from './LoginScreen';
import CustomSearchScreen from './CustomSearchScreen';
import FactCheckScreen from './FactCheckScreen';
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook for handling color scheme (light/dark mode)
import CheckedScreen from './CheckedScreen';
import SignUpScreen from './SignUpScreen';
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Warning: ...', // Add specific warnings you want to ignore
]);

// Or, to ignore all warnings
LogBox.ignoreAllLogs(true);


SplashScreen.preventAutoHideAsync(); // Prevents the splash screen from hiding before fonts are loaded

const Stack = createNativeStackNavigator(); // Stack Navigator for screen transitions
const Tab = createBottomTabNavigator(); // Bottom Tab Navigator for the main app navigation

// Main Tabs navigation for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F5F8FA',
          height: 60,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b0b0b0',
      }}
    >
      <Tab.Screen
        name="FactCheck"
        component={FactCheckScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={color === '#fff' ? require('../assets/images/home_active.png') : require('../assets/images/home_inactive.png')}
              style={{
                width: color === '#fff' ? 70 : 30,
                height: color === '#fff' ? 70 : 30,
                marginTop: color === '#fff' ? -30 : 20,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Checked"
        component={CheckedScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={color === '#fff' ? require('../assets/images/checked_active.png') : require('../assets/images/checked_inactive.png')}
              style={{
                width: color === '#fff' ? 70 : 30,
                height: color === '#fff' ? 70 : 30,
                marginTop: color === '#fff' ? -30 : 20,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CustomSearch"
        component={CustomSearchScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={color === '#fff' ? require('../assets/images/history_active.png') : require('../assets/images/history_inactive.png')}
              style={{
                width: color === '#fff' ? 70 : 30,
                height: color === '#fff' ? 70 : 30,
                marginTop: color === '#fff' ? -30 : 20,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    FuturaPTBook: require('../assets/fonts/FuturaPTBook.otf'),
  });

  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Firebase authentication state listener to check if user is logged in or logged out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user); // Updates the loggedIn state based on whether a user is authenticated
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  if (!loaded) {
    return null; // Wait for fonts to load before rendering the UI
  }

  return (
    <Stack.Navigator initialRouteName={loggedIn ? "MainTabs" : "LoginScreen"}>

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }} // No header for the Login Screen
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }} // No header for the Sign-Up Screen
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }} // No header for the Main Tabs Screen
      />
      <Stack.Screen
        name="FactCheckScreen"
        component={MainTabs}
        options={{ headerShown: false }} // No header for FactCheckScreen when within MainTabs
      />
    </Stack.Navigator>
  );
}
