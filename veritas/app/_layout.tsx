import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth'; // Importing Firebase authentication listener
import { auth } from './firebase'; // Importing the Firebase auth instance configured in a separate file
import { Image } from 'react-native';
import LoginScreen from './LoginScreen';
import HistoryScreen from './HistoryScreen';
import FactCheckScreen from './FactCheckScreen';
import { useColorScheme } from '@/hooks/useColorScheme'; // Custom hook for managing color scheme
import CheckedScreen from './CheckedScreen';

SplashScreen.preventAutoHideAsync(); // Preventing the splash screen from hiding until we're ready

const Stack = createNativeStackNavigator(); // Creating a stack navigator for screen transitions
const Tab = createBottomTabNavigator(); // Creating a bottom tab navigator for main tabs

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
        name="History"
        component={HistoryScreen}
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

  const [loggedIn, setLoggedIn] = useState(false); // State to track user authentication status

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hiding splash screen after fonts are loaded
    }
  }, [loaded]);

  useEffect(() => {
    // Firebase auth state listener to track user login/logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user); // Updating loggedIn state based on user authentication status
    });
    return unsubscribe; // Cleanup function to unsubscribe from listener on component unmount
  }, []);

  if (!loaded) {
    return null; // Prevent rendering until fonts are loaded
  }

  return (
    <Stack.Navigator initialRouteName={loggedIn ? "MainTabs" : "LoginScreen"}>
      {/* Navigating to MainTabs if the user is logged in; otherwise, show LoginScreen */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FactCheckScreen"
        component={MainTabs} // This screen is integrated within the MainTabs component
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
