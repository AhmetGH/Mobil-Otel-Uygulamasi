import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function App({navigation}) {
  const [selectedRoomType, setSelectedRoomType] = useState('singleRoom');
  const [roomData, setRoomData] = useState([]);

  const handleFetchData = async () => {
    const collectionName = selectedRoomType;
    const roomCollection = collection(db, collectionName);

    try {
      const querySnapshot = await getDocs(roomCollection);

      if (querySnapshot.empty) {
        setRoomData([]);
      } else {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRoomData(data);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  const handleRoomTypeChange = async (itemValue) => {
    setSelectedRoomType(itemValue);
    await handleFetchData();
  };

  const handleDeleteItem = async (odaNumarasi) => {
    const collectionName = selectedRoomType;
    const roomQuery = query(collection(db, collectionName), where('roomNo', '==', odaNumarasi.toString()));

    try {
      const querySnapshot = await getDocs(roomQuery);

      if (querySnapshot.empty) {
        alert('Bu oda numarasına ait veri bulunamadı!');
      } else {
        const docId = querySnapshot.docs[0].id;
        const roomDocRef = doc(collection(db, collectionName), docId);

        await deleteDoc(roomDocRef);
        await handleFetchData();
        console.log('Veri silindi');
      }
    } catch (error) {
      console.error('Veri silme hatası:', error);
    }
  };

  const confirmDelete = (odaNumarasi) => {
    Alert.alert(
      'Silme İşlemi',
      'Bu oda numarasına ait veriyi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', onPress: () => handleDeleteItem(odaNumarasi) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Oda Bilgileri</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Oda Tipi:</Text>
        <Picker
          selectedValue={selectedRoomType}
          onValueChange={handleRoomTypeChange}
          style={styles.picker}
        >
          <Picker.Item label="Tek kişilik" value="singleRoom" />
          <Picker.Item label="Çift Kişilik" value="doubleRoom" />
          <Picker.Item label="Çocuklu Çift Kişilik" value="doubleRoomWithChild" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleFetchData}>
          <Text style={styles.buttonText}>Verileri Getir</Text>
        </TouchableOpacity>

        <FlatList
          data={roomData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.roomItem}>
              <Text>Maliyet: {item.Cost}</Text>
              <Text>Oda No: {item.roomNo}</Text>
              <TouchableOpacity onPress={() => confirmDelete(item.roomNo)}>
                <Text style={styles.deleteButton}>Sil</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  roomItem: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    color: 'red',
  },
});
