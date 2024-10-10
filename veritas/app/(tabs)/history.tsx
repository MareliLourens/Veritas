import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';

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
        <Image style={styles.icon} source={require('../../assets/images/document_icon.png')} />
        <View style={styles.textSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.percentage}>{item.percentage}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.background}></View>
      <ThemedText type="title" style={styles.header}>History</ThemedText>
      <FlatList
        data={data}
        renderItem={renderItem}
      />
      {/* <View style={styles.navBar}>
        <Image style={styles.navIcon} source={require('../../assets/images/home.png')} />
        <Image style={styles.navIcon} source={require('../../assets/images/home.png')} />
        <Image style={styles.navIcon} source={require('../../assets/images/home.png')} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B7E4FA',
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  background:{
    backgroundColor: '#FFFFFF',
    height: 400,
    width: 500,
    position: 'absolute',
    bottom: 0,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    height: 96,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 37,
    height: 51,
    marginRight: 15,
    objectFit: 'contain',
  },
  textSection: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2
  },
  date: {
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'MontserratReg',
  },
  percentage: {
    fontSize: 32,
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
