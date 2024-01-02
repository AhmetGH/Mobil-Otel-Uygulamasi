// mainMenu.js
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuHotel from '../crudHotel/menuHotel';
import CreateHotel from '../crudHotel/createHotel';
import UpdateHotel from '../crudHotel/updateHotel';
import ListHotel from '../crudHotel/listHotel';
import Appointment from '../customerProcess/appointment';
import Admin from '../UserOperations/admin';
import Profile from '../UserOperations/profile';
import App from '../App';
import Room from '../customerProcess/room';
import RoomResult from '../customerProcess/roomresult';
import Entry from '../UserOperations/entry';
import {getDoc,doc} from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/*function LoginMenu({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}*/

function CrudMenu() {
  return (
    <Stack.Navigator initialRouteName="MenuHotel">
      <Stack.Screen name="MenuHotel" component={MenuHotel} options={{headerShown: false}}/>
      <Stack.Screen name="CreateHotel" component={CreateHotel} options={{ title: 'Menüye dön' }}/>
      <Stack.Screen name="UpdateHotel" component={UpdateHotel} options={{ title: 'Menüye dön' }}/>
      <Stack.Screen name="ListHotel" component={ListHotel} options={{ title: 'Menüye dön' }}/>
    </Stack.Navigator>
  );
}



export default function MainMenu({ route, navigation }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userAuthority, setUserAuthority] = useState('');

  useEffect(() => {
    if (route && route.params && route.params.userId && !isLoggedIn) {
      setLoggedIn(true);
  
      // Kullanıcı ID'sini al
      const userId = route.params.userId;
  
      // Firestore'dan kullanıcı dokümanını al
      const userRef = doc(db, 'users', userId);
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // Doküman varsa authority'yi al
            const userAuthority = docSnapshot.data().authority;
            setUserAuthority(userAuthority);
  
            // Log ekle
            console.log('User logged in with authority:', userAuthority);
          } else {
            console.log('User document not found.');
          }
        })
        .catch((error) => {
          console.error('Error getting user document:', error);
        });
    }
  }, [route, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('Appointment', { userId: route.params.userId });
    }
  }, [isLoggedIn, navigation, route.params.userId]);

  return (
    <Drawer.Navigator initialRouteName="ReservationMenu" independent={true}>
      
      <Drawer.Screen
        name="Rezervasyon İşlemleri"
        component={ReservationMenu}
        options={{ userId: route.params.userId }}
      />
      {isLoggedIn && userAuthority === 'admin' ? (
        <>
          {console.log('User has admin authority.')}

          <Drawer.Screen
            name="Otel işlemleri"
            component={CrudMenu}
            options={{ userId: route.params.userId }}
          />
          <Drawer.Screen
            name="Admin Paneli"
            component={Admin}
            initialParams={{ userId: route.params.userId }}
            />
          <Drawer.Screen
            name="Giriş Kaydı"
            component={Entry}
            initialParams={{ userId: route.params.userId }}
          />
        </>
      ) : null}
      <Drawer.Screen
        name="Profil"
        component={Profile}
        initialParams={{ userId: route.params.userId }}
        />
      <Drawer.Screen
        name="Rezervasyonlarım"
        component={RoomResult}
        initialParams={{ userId: route.params.userId }}
        />
      <Drawer.Screen
        name="Çıkış Yap"
        component={App}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

function ReservationMenu() {
  return (
    <Stack.Navigator initialRouteName="Appointment">
      <Stack.Screen
        name="Appointment"
        component={Appointment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Room"
        component={Room}
        options={{ title: 'Rezervasyon Menüsüne dön' ,
      }}
        />
    </Stack.Navigator>
  );
}