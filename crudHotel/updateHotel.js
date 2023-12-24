import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, getDocs,updateDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function App({navigation}) {
  const [maliyet, setMaliyet] = useState('');
  const [odaNumarasi, setOdaNumarasi] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('singleRoom');

  const handleFetchData = async () => {
    if (!odaNumarasi) {
      alert('Lütfen Oda numarası Giriniz!');
      return;
    }

    const collectionName = selectedRoomType;
    const roomCollection = collection(db, collectionName);
    const roomQuery = query(roomCollection, where('roomNo', '==', odaNumarasi));

    try {
      const querySnapshot = await getDocs(roomQuery);

      if (querySnapshot.empty) {
        alert('Bu oda numarasına ait veri bulunamadı!');
      } else {
        const data = querySnapshot.docs[0].data();
        setMaliyet(data.Cost);
        // Diğer alanları da bu şekilde ayarlayabilirsiniz

        // Şimdi alınan verileri formda gösterebilirsiniz
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  const handleUpdateData = async () => {
    if (!odaNumarasi || !selectedRoomType) {
      alert('Lütfen Oda numarası ve Oda tipi giriniz!');
      return;
    }
  
    const collectionName = selectedRoomType;
    const roomCollection = collection(db, collectionName);
    const roomQuery = query(roomCollection, where('roomNo', '==', odaNumarasi));
  
    try {
      const querySnapshot = await getDocs(roomQuery);
  
      if (querySnapshot.empty) {
        alert('Bu oda numarasına ait veri bulunamadı!');
      } else {
        const docRef = querySnapshot.docs[0].ref;
  
        const updatedData = {
          Cost: maliyet,
        };
  
        // Veriyi güncelleyin
        await updateDoc(docRef, updatedData);
  
        console.log('Veri güncellendi');
      }
    } catch (error) {
      console.error('Veri güncelleme hatası:', error);
    }
  };

  const handleRoomTypeChange = async (itemValue) => {
    setSelectedRoomType(itemValue);
    await handleFetchData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Maliyet Güncelle</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Oda Tipi:</Text>
        <Picker
          selectedValue={selectedRoomType}
          onValueChange={handleRoomTypeChange}
          style={styles.picker}
        >
          <Picker.Item label="Tek kişilik" value="singleRoom" />
          <Picker.Item label="Çift Kişilik" value="doubleRoom" />
          <Picker.Item label="Çocuklu Çift kişilik" value="doubleRoomWithChild" />
        </Picker>

        <Text style={styles.label}>Oda Numarası:</Text>
        <TextInput
          style={styles.input}
          value={odaNumarasi}
          onChangeText={(value) => setOdaNumarasi(value)}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleFetchData}>
          <Text style={styles.buttonText}>Verileri Getir</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Maliyet:</Text>
        <TextInput
          style={styles.input}
          value={maliyet}
          onChangeText={(value) => setMaliyet(value)}
          keyboardType="numeric"
        />

        {/* Diğer alanlar da buraya ekleyebilirsiniz */}

        <TouchableOpacity style={styles.button} onPress={handleUpdateData}>
          <Text style={styles.buttonText}>Verileri Güncelle</Text>
        </TouchableOpacity>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
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
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});
