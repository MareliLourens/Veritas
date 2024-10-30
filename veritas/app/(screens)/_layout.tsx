// Import necessary components from the Expo Router and React
import { Tabs } from 'expo-router';
import React from 'react';

// Import custom components and constants
import { Colors } from '@/constants/Colors'; // Color constants for the application
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook to determine the current color scheme (light or dark)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HistoryScreen from '../HistoryScreen';
import FactCheckScreen from '../FactCheckScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// Define the TabLayout functional component
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'white' }, // Customize tab bar style
      }}
    >
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ 
          tabBarLabel: 'History', // Set tab label
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="FactCheck" 
        component={FactCheckScreen} 
        options={{ 
          tabBarLabel: 'Fact Check', // Set tab label
          headerShown: false 
        }}
      />
    </Tab.Navigator>
  );
}
