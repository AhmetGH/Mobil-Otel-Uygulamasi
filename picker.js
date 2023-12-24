import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet,TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default function App() {
  const [maliyet, setMaliyet] = useState('');
  const [odaNumarasi, setOdaNumarasi] = useState('');
  const [selectedDay, setSelectedDay] = useState('Pazartesi');

  const handleSubmit = () => {
    // Form verilerini işleme ekle
    console.log('Maliyet:', maliyet);
    console.log('Oda Numarası:', odaNumarasi);
    console.log('Seçili Gün:', selectedDay);
  };

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

        <Text style={styles.label}>Gün Seçimi:</Text>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pazartesi" value="Pazartesi" />
          <Picker.Item label="Salı" value="Salı" />
          <Picker.Item label="Çarşamba" value="Çarşamba" />
          <Picker.Item label="Perşembe" value="Perşembe" />
          <Picker.Item label="Cuma" value="Cuma" />
          <Picker.Item label="Cumartesi" value="Cumartesi" />
          <Picker.Item label="Pazar" value="Pazar" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
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