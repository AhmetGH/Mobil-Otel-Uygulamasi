// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from '../firebase';

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Firestore "users" koleksiyonunu referans al
    const usersCollection = collection(db, 'users');

    // TC No ve email kombinasyonunu kontrol eden bir sorgu oluştur
    const userQuery = query(usersCollection, where('tcNo', '==', tcNo), where('email', '==', email));

    // Sorguyu çalıştır ve sonuçları al
    const querySnapshot = await getDocs(userQuery);

    // Eğer kullanıcı zaten varsa, uyarı göster ve işlemi sonlandır
    if (!querySnapshot.empty) {
      alert('Bu TC No ve email kombinasyonu zaten kullanılmaktadır.');
      return;
    }

    // Şifreleri karşılaştır ve eğer uyuşmuyorsa uyarı göster
    if (password !== confirmPassword) {
      alert('Şifreler uyuşmuyor.');
      return;
    }

    // Kullanıcıyı Firestore'a ekle
    try {
      await addDoc(usersCollection, {
        tcNo: tcNo,
        email: email,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        age: age,
        password: password,
        authority:'user',
      });
      navigation.navigate('Login');
    } catch (error) {
      console.error('Kayıt sırasında bir hata oluştu:', error);
      alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
      />

      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Age"
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="TC No"
        onChangeText={(text) => setTcNo(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  picker: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
