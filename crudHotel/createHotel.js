import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from '../firebase';


export default function CreateHotel({ navigation }) {
  const [maliyet, setMaliyet] = useState('');
  const [odaNumarasi, setOdaNumarasi] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('singleRoom');
  const [days, setDays] = useState(false);

  const handleSubmit = () => {
    // Form verilerini işleme ekle
    console.log('Maliyet:', maliyet);
    console.log('Oda Numarası:', odaNumarasi);
    console.log('Seçili Gün:', selectedRoomType);
  };

  function create() {
    if (maliyet === '') {
      alert('Lütfen Maliyet Giriniz!');
      return;
    }
    if (odaNumarasi === '') {
      alert('Lütfen Oda numarası Giriniz!');
      return;
    }
    const collectionName = selectedRoomType;
    const roomCollection = collection(db, collectionName);

    // Check if the room number already exists
    const roomQuery = query(roomCollection, where('roomNo', '==', odaNumarasi));

    getDocs(roomQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Room number already exists
          alert('Bu oda numarası zaten kullanımda!');
        } else {
          // Room number doesn't exist, proceed with adding the document
          Alert.alert('Bildirim', 'Oda Ekleme işleminiz gerçekleştirilmiştir.');
          addDoc(roomCollection, {
            Cost: maliyet,
            roomNo: odaNumarasi,
            Mondey: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: '',
          })
            .then(() => {
              console.log('data submitted');
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Oda Ekleme</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Maliyet:</Text>
          <TextInput
            style={styles.input}
            value={maliyet}
            onChangeText={(value) => setMaliyet(value)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Oda Numarası:</Text>
          <TextInput
           style={styles.input}
           value={odaNumarasi}
           onChangeText={(value) => setOdaNumarasi(value)}
           keyboardType="numeric"
          />

          <Text style={styles.label}>Oda Tipi:</Text>
          <Picker
            selectedValue={selectedRoomType}
            onValueChange={(itemValue) => setSelectedRoomType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tek kişilik" value="singleRoom" />
            <Picker.Item label="Çift Kişilik" value="doubleRoom" />
            <Picker.Item label="Çocuklu Çİft kişilik" value="doubleRoomWithChild" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={create}>
            <Text style={styles.buttonText}>Odayı ekle</Text>
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
    borderRadius:10,
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
  menuButton: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
