// profile.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const userId = route?.params?.userId;

  useEffect(() => {
    if (!userId) {
      console.error('Kullanıcı Kimliği sağlanmadı.');
      return;
    }

    const userRef = doc(db, 'users', userId);

    const getUserData = async () => {
      try {
        const userDocSnapshot = await getDoc(userRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
        } else {
          console.log('Kullanıcı belgesi bulunamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı belgesi alınırken hata oluştu:', error);
      }
    };

    getUserData();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kullanıcı Profili</Text>
      <Text style={styles.text}>Ad: {userData.firstName}</Text>
      <Text style={styles.text}>Soyad: {userData.lastName}</Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
      <Text style={styles.text}>Yaş: {userData.age}</Text>
      <Text style={styles.text}>TC Kimlik No: {userData.tcNo}</Text>
      <Text style={styles.text}>Cinsiyet: {userData.gender}</Text>
      <Text style={styles.text}>Otorite: {userData.authority}</Text>
      {/* Diğer kullanıcı bilgilerini buraya ekleyebilirsiniz */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Profile;
