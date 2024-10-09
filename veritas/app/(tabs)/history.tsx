import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import React from 'react';

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  percentage: number;
}

const data: HistoryItem[] = [
  { id: 1, title: 'Lions are mammals', date: '20 June 2024', percentage: 100 },
  { id: 2, title: 'Capitec debt', date: '20 June 2024', percentage: 75 },
  { id: 3, title: 'Document Name', date: '', percentage: 0 }
];

data.map((item: HistoryItem) => (
  <View key={item.title}>
    <Text>{item.title}</Text>
    <Text>{item.date}</Text>
    <Text>{item.percentage}%</Text>
  </View>
));

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={styles.leftSection}>
        <Image style={styles.icon} source={require('../../assets/images/icon.png')} />
        <View style={styles.textSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.percentage}>{item.percentage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
      />
      {/* Navigation Bar
      <View style={styles.navBar}>
        <Image style={styles.navIcon} source={require('../../assets/icons/home.png')} />
        <Image style={styles.navIcon} source={require('../../assets/icons/history.png')} />
        <Image style={styles.navIcon} source={require('../../assets/icons/user.png')} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FF',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  textSection: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  percentage: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});
