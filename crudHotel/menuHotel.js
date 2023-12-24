// MenuHotel.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App({ navigation }) {

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Otel Menüsü</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("CreateHotel")}>
          <Text style={styles.menuText}>Oda Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("UpdateHotel")}>
          <Text style={styles.menuText}>Oda Güncelle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ListHotel")}>
          <Text style={styles.menuText}>Odaları Listele</Text>
        </TouchableOpacity>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: 'black',
  },
});
