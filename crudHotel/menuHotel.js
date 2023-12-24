// MenuHotel.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateHotel from './createHotel';
import UpdateHotel from './updateHotel';
import ListHotel from './listHotel';

const Stack = createStackNavigator();

export default function MenuHotel({ navigation }) {
  const navigateToUpdateHotel = () => {
    navigation.navigate('UpdateHotel');
  };

  const navigateToListHotel = () => {
    navigation.navigate('ListHotel');
  };

  const navigateToCreateHotel = () => {
    navigation.navigate('CreateHotel');
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="CreateHotel" component={CreateHotel} />
      <Stack.Screen name="UpdateHotel" component={UpdateHotel} />
      <Stack.Screen name="ListHotel" component={ListHotel} />
    </Stack.Navigator>
  );

  function MenuScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Otel Menüsü</Text>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToCreateHotel}>
          <Text style={styles.menuText}>Oda Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToUpdateHotel}>
          <Text style={styles.menuText}>Oda Güncelle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToListHotel}>
          <Text style={styles.menuText}>Odaları Listele</Text>
        </TouchableOpacity>
      </View>
    );
  }
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
