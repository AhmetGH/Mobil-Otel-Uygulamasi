import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const EntryList = () => {
  const [entryData, setEntryData] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const getEntries = async () => {
      try {
        const entryRef = collection(db, 'entry');
        const querySnapshot = await getDocs(entryRef);
        const entries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntryData(entries);

        // Toplam belge sayısını ve her ID'ye ait "cost" değerlerini topla
        const totalDocCount = querySnapshot.size;
        const totalCostSum = entries.reduce((sum, entry) => sum + parseFloat(entry.cost), 0);

        setTotalDocuments(totalDocCount);
        setTotalCost(totalCostSum);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    getEntries();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Müşteri Kayıt Listesi</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Giriş Sayısı:</Text>
          <Text style={styles.summaryValue}>{totalDocuments}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Kazanç:</Text>
          <Text style={styles.summaryValue}>{totalCost}</Text>
        </View>
      </View>
      <FlatList
        data={entryData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryItem}>
            <Text>Oda Numarası: {item.roomNo}</Text>
            <Text>Oda Türü: {item.roomType}</Text>
            <Text>Ad: {item.firstName}</Text>
            <Text>Soyad: {item.surName}</Text>
            <Text>TC Kimlik No: {item.tcNo}</Text>
            <Text>Ücret: {item.cost}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryItem: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
    marginRight: 10,
    borderRadius: 5,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 18,
    marginTop: 5,
  },
  entryItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
});

export default EntryList;
