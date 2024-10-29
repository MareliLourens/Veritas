// Import necessary components from the Expo Router and React
import { Tabs } from 'expo-router';
import React from 'react';

// Import custom components and constants
import { Colors } from '@/constants/Colors'; // Color constants for the application
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook to determine the current color scheme (light or dark)

// Define the TabLayout functional component
export default function TabLayout() {
  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  return (
    // Render the Tabs component with specific options
    <Tabs
      screenOptions={{
        // Set the active tint color for the tab bar based on the current color scheme
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Hide the header for the tabs
                                       tabBarStyle: { display: 'none' }, // Uncomment to hide the tab bar
      }}>
      {/* Define the first tab for Home */}
      <Tabs.Screen
        name="index" // The name of the screen, used for navigation
        options={{
          title: 'Home', // Title displayed on the tab
          // Render the tab bar icon conditionally based on whether the tab is focused
         
        }}
      />
      {/* Define the second tab for History */}
      
      <Tabs.Screen
        name="history" // The name of the screen for the History tab
        options={{
          title: 'History', // Title displayed on the tab 
          // Render the tab bar icon conditionally based on whether the tab is focused
         
        }}
      />
    </Tabs>
  );
}
