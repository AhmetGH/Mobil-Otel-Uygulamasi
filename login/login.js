import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { collection, getDocs,query, where } from "firebase/firestore";
import { db } from '../firebase';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert('Uyarı', 'E-posta vaya şifre boş bırakılamaz.');
      return;
    }

    const usersCollection = query(
      collection(db, 'users'),
      where('email', '==', email),
      where('password', '==', password)
    );

    try {
      const querySnapshot = await getDocs(usersCollection);

      if (!querySnapshot.empty) {
        console.log('Giriş başarılı!');
        const userId = querySnapshot.docs[0].id;
        navigation.navigate('MainMenu', { userId });
      } else {
        console.log('Kullanıcı bulunamadı veya şifre hatalı.');
        Alert.alert('Kullanıcı bulunamadı veya şifre hatalı.');
      }
    } catch (error) {
      console.error('Giriş sırasında bir hata oluştu:', error);
    }
  };

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Giriş Yapın</Text>

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Hesabınız yok mu? Hemen buraya tıklayarak kaydolun. </Text>
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
    borderRadius:10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
