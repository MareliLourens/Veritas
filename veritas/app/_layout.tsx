import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Image } from 'react-native';
import LoginScreen from './LoginScreen';
import HistoryScreen from './HistoryScreen';
import FactCheckScreen from './FactCheckScreen';

import { useColorScheme } from '@/hooks/useColorScheme';
import CheckedScreen from './CheckedScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// MainTabs component for bottom tab navigation
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F5F8FA', // Set your desired background color
          height: 60, // Customize height
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        },
        tabBarLabelStyle: {
          fontSize: 14, // Customize label font size
          fontWeight: 'bold', // Customize label font weight
        },
        tabBarActiveTintColor: '#fff', // Color for active tab
        tabBarInactiveTintColor: '#b0b0b0', // Color for inactive tabs
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
                width: color === '#fff' ? 70 : 30, // Set width based on active state
                height: color === '#fff' ? 70 : 30, // Set height based on active state
                marginTop: color === '#fff' ? -30 : 20, // Set margin based on active state
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
                width: color === '#fff' ? 70 : 30, // Set width based on active state
                height: color === '#fff' ? 70 : 30, // Set height based on active state
                marginTop: color === '#fff' ? -30 : 20, // Set margin based on active state
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
                width: color === '#fff' ? 70 : 30, // Set width based on active state
                height: color === '#fff' ? 70 : 30, // Set height based on active state
                marginTop: color === '#fff' ? -30 : 20, // Set margin based on active state
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

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  if (!loaded) {
    return null; // Show nothing until fonts are loaded
  }

  return (

    <Stack.Navigator initialRouteName={loggedIn ? "MainTabs" : "LoginScreen"}>
      {/* Login Screen Route */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Main Tab Navigator Route */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* Direct Access Route to FactCheckScreen */}
      <Stack.Screen
        name="FactCheckScreen"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
