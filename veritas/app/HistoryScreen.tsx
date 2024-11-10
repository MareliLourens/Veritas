import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RootState } from '../app/store';

export default function HistoryScreen() {
  const history = useSelector((state: RootState) => state.history.history);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.percentage}>{item.percentage}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#7E7E7E',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
