// admin.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

const Admin = ({ route}) => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const adminId = route.params?.userId;

  useEffect(() => {
    const getUsers = async () => {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    getUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kullanıcılar</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem}
            onPress={() => navigation.navigate('Profil', { adminId,userId: item.id })}
          >
            <Text style={styles.username}>{item.firstName}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.authority}>{item.authority}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  authority: {
    fontSize: 16,
    color: 'green',
  },
});

export default Admin;
