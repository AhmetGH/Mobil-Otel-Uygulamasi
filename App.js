// app.js

import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './login/login';
import Register from './login/register';
import MainMenu from './mainMenu/mainMenu';

const Stack = createStackNavigator();

export default function App({ route, navigation }) {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (route && route.params && route.params.userId && !isLoggedIn) {
      setLoggedIn(true);
      // Eğer giriş yapıldıysa, MainMenu ekranına git
      navigation.navigate('MainMenu', { userId: route.params.userId });
    }
  }, [route, isLoggedIn, navigation]);

  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="LoginMenu">
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainMenu" component={MainMenu} options={{headerShown: false}}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

/*<NavigationContainer>
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
    </NavigationContainer>*/