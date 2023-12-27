import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput,TouchableOpacity} from 'react-native';
import { useState } from 'react';
import {collection,doc,setDoc,addDoc,updateDoc,deleteDoc} from "firebase/firestore";
import { db } from '../firebase';



export default function App() {
  const[username,setName]=useState('');
  const[email,setEmail]=useState('');


  const deleteDocument = async () => {
    const userId = 2;
    const docRef = doc(db, 'users', 'LA', userId.toString());

    try {
      await deleteDoc(docRef);
      console.log(`Document with ID ${userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  /*function create(){
    setDoc(doc(db,"users","LA"),{
      username:username,
      email:email,
  
    }).then(()=>{
      console.log('data submitted');
  
    }).catch((error)=>{
      console.log(error);
    });
  }*/
  function create(){
    addDoc(collection(db,"users"),{
      username:username,
      email:email,
  
    }).then(()=>{
      console.log('data submitted');
  
    }).catch((error)=>{
      console.log(error);
    });
  }
  function update(){
    updateDoc(doc(db,"users",'LA'),{
      username:username,
      email:email,
  
    }).then(()=>{
      console.log('data submitted');
  
    }).catch((error)=>{
      console.log(error);
    });
  }

  

  return (
    <View style={styles.container}>
      <Text>Firebase crud</Text>
      <TextInput value={username} onChangeText={(username)=>{setName(username)}} placeholder="Username" style={styles.textBoxes}></TextInput>
      <TextInput value={email} onChangeText={(email)=>{setEmail(email)}} placeholder="Email" style={styles.textBoxes}></TextInput>
      <TouchableOpacity style={styles.button} onPress={deleteDocument}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxes:{
    width:'90%',
    fontSize:18,
    padding:12,
    borderColor:'gray',
    borderWidth:0.2,
    borderRadius:10
  },button: {
    width: 200,
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop:10
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});



// app.js

import React, { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuHotel from '../crudHotel/menuHotel';
import CreateHotel from '../crudHotel/createHotel';
import UpdateHotel from '../crudHotel/updateHotel';
import ListHotel from '../crudHotel/listHotel';
import Login from '../login/login';
import Register from '../login/register';
import Appointment from '../customerProcess/appointment';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function LoginMenu({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function CrudMenu() {
  return (
    <Stack.Navigator initialRouteName="MenuHotel">
      <Stack.Screen name="MenuHotel" component={MenuHotel} />
      <Stack.Screen name="CreateHotel" component={CreateHotel} />
      <Stack.Screen name="UpdateHotel" component={UpdateHotel} />
      <Stack.Screen name="ListHotel" component={ListHotel} />
    </Stack.Navigator>
  );
}



export default function App({route}) {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (route && route.params && route.params.userId && !isLoggedIn) {
      setLoggedIn(true);
    }
  }, [route, isLoggedIn]);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={isLoggedIn ? "ReservationMenu" : "LoginMenu"} drawerType={isLoggedIn ? 'slide' : 'front'}>
        {isLoggedIn ? (
          <>
            <Drawer.Screen name="CrudMenu" component={CrudMenu} />
            <Drawer.Screen name="ReservationMenu" component={ReservationMenu} />
          </>
        ) : (
          <Drawer.Screen
            name="LoginMenu"
            component={LoginMenu}
            options={{ swipeEnabled: false }}
          />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function ReservationMenu() {
  return (
    <Stack.Navigator initialRouteName="Appointment">
      <Stack.Screen name="Appointment" component={Appointment} />
    </Stack.Navigator>
  );
}

import { View, TouchableOpacity, Image, StyleSheet,Text,ScrollView } from 'react-native';
import React, {useEffect } from 'react';

const Appointment = ({ route }) => {
  const userId = route.params?.userId;

  useEffect(() => {
    if (userId) {
      // userId'yi kullanarak gerekli işlemleri gerçekleştirin
      console.log('User ID:', userId);
    }
  }, [userId]);

  const images = [
    require('../assets/singleRoom.jpg'),
    require('../assets/doubleroom.jpg'),
    require('../assets/doubleroomwithchild.jpg'),
  ];

  const roomTypes = [
    'Tek kişilik oda',
    'Çift kişilik oda',
    'Çocuklu çift kişilik oda',
  ];
  // userId'yi kullanarak gerekli işlemleri gerçekleştirin
  /*<Text>Appointment Page - User ID: {userId}</Text>*/
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      
    {images.map((image, index) => (
      <View key={index} style={styles.squareContainer}>
        <TouchableOpacity style={styles.square}>
          <Image source={image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.roomType}>{roomTypes[index]}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  squareContainer: {
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  square: {
    width: 200,
    height: 200,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  roomType: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Appointment;