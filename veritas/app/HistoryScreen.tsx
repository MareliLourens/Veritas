// Import necessary components and libraries from React Native
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';

// Define the structure of each history item using TypeScript interface
interface HistoryItem {
  id: number;         // Unique identifier for the history item
  title: string;      // Title of the history item
  date: string;       // Date associated with the history item
  percentage: number; // Percentage related to the history item
}

// Sample data for the history items
const data: HistoryItem[] = [
  { id: 1, title: 'Lions are mammals', date: '20 June 2024', percentage: 100 },
  { id: 2, title: 'Capitec debt', date: '20 June 2024', percentage: 75 },
  { id: 3, title: 'Document Name', date: 'Date', percentage: 0 }
];

// Map through data (this is unused and can be removed)
data.map((item: HistoryItem) => (
  <View key={item.title}>
    <Text>{item.title}</Text>
    <Text>{item.date}</Text>
    <Text>{item.percentage}%</Text>
  </View>
));

// Define the HistoryScreen functional component
export default function HistoryScreen() {
  // Function to render each item in the FlatList
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={styles.leftSection}>
        <Image style={styles.icon} source={require('../assets/images/icon.png')} />
        <View style={styles.textSection}>
          {/* Display the title and date of the item */}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      {/* Display the percentage for the item */}
      <Text style={styles.percentage}>{item.percentage}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background view at the bottom of the screen */}
      <View style={styles.background}></View>
      {/* Header text for the history screen */}
      <ThemedText type="title" style={styles.header}>History</ThemedText>
      {/* FlatList component to render the list of history items */}
      <FlatList
        data={data}
        renderItem={renderItem}
      />
      {/* Uncomment below to add a navigation bar at the bottom */}
      {/* 
      <View style={styles.navBar}>
        <Image style={styles.navIcon} source={require('../../assets/images/home.png')} />
        <Image style={styles.navIcon} source={require('../../assets/images/home.png')} />
        <Image style={styles.navIcon} source={require('../../assets/images/home.png')} />
      </View>
      */}
    </View>
  );
}

// Define styles for the component using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,                         // Make the container fill the entire screen
    backgroundColor: '#B7E4FA',     // Set background color
    paddingTop: 35,                  // Add top padding
    paddingHorizontal: 20,           // Add horizontal padding
  },
  background: {
    backgroundColor: '#FFFFFF',      // Set background color for the bottom view
    height: 400,                      // Set height
    width: 500,                       // Set width
    position: 'absolute',             // Position it absolutely
    bottom: 0,                        // Align to the bottom
  },
  header: {
    fontSize: 20,                    // Set font size for the header
    marginBottom: 20,                // Add bottom margin
    color: '#000',                   // Set text color
  },
  item: {
    flexDirection: 'row',            // Align items in a row
    justifyContent: 'space-between',  // Space items evenly
    alignItems: 'center',            // Center align items vertically
    backgroundColor: '#F5F8FA',      // Set background color for each item
    borderRadius: 10,                 // Round the corners
    padding: 15,                     // Add padding
    marginBottom: 15,                // Add bottom margin
    height: 96,                      // Set height for each item
  },
  leftSection: {
    flexDirection: 'row',            // Align icon and text in a row
    alignItems: 'center',            // Center align vertically
  },
  icon: {
    width: 37,                       // Set width for the icon
    height: 51,                      // Set height for the icon
    marginRight: 15,                 // Add right margin
    objectFit: 'contain',            // Maintain aspect ratio
  },
  textSection: {
    justifyContent: 'center',        // Center the text vertically
  },
  title: {
    fontSize: 17,                   // Set font size for the title
    fontWeight: 'bold',              // Make the title bold
    color: '#000',                   // Set title color
    marginBottom: 2                  // Add bottom margin
  },
  date: {
    fontSize: 16,                   // Set font size for the date
    color: '#7D7D7D',                // Set date color
    fontFamily: 'MontserratReg',     // Set font family
  },
  percentage: {
    fontSize: 32,                   // Set font size for the percentage
    fontWeight: 'bold',              // Make the percentage bold
    color: '#000',                   // Set percentage color
  },
  navBar: {
    flexDirection: 'row',            // Align navigation icons in a row
    justifyContent: 'space-between',  // Space icons evenly
    paddingHorizontal: 40,           // Add horizontal padding
    paddingVertical: 15,             // Add vertical padding
    backgroundColor: '#FFFFFF',      // Set background color for the nav bar
    borderTopLeftRadius: 30,         // Round top left corner
    borderTopRightRadius: 30,        // Round top right corner
    position: 'absolute',             // Position absolutely
    bottom: 0,                        // Align to the bottom
    width: '100%',                   // Set width to 100%
    elevation: 10,                   // Add elevation for shadow effect
  },
  navIcon: {
    width: 30,                       // Set width for the navigation icon
    height: 30,                      // Set height for the navigation icon
  },
});
