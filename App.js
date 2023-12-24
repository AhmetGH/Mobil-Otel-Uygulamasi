// app.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuHotel from './crudHotel/menuHotel';
import Login from './login/login';


import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="MenuHotel">
        <Drawer.Screen name="MenuHotel" component={MenuHotel} />
        <Drawer.Screen name="Login" component={Login} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
