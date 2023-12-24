// app.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuHotel from './crudHotel/menuHotel';
import CreateHotel from './crudHotel/createHotel';
import UpdateHotel from './crudHotel/updateHotel';
import ListHotel from './crudHotel/listHotel';
import Login from './login/login';
import Register from './login/register';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CrudMenu(){
  return(
  <Stack.Navigator initialRouteName="MenuHotel">
  <Stack.Screen name="MenuHotel" component={MenuHotel} />
  <Stack.Screen name="CreateHotel" component={CreateHotel} />
  <Stack.Screen name="UpdateHotel" component={UpdateHotel} />
  <Stack.Screen name="ListHotel" component={ListHotel} />
  </Stack.Navigator>
  );
}

function LoginMenu(){
  return(
  <Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" component={Login} />
  <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen name="CrudMenu" component={CrudMenu} />
        <Drawer.Screen name="LoginMenu" component={LoginMenu} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


