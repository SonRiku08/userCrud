import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Home';
import Update from './pages/Update'
import Login from './pages/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  updateUser = (newUser) => {
    setUser({
      id: newUser.id,
      email: newUser.email,
      password: newUser.password,
    });
  };

  const logOut = () => {
    setUser(null);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name='Home'
              component={Home}
              initialParams={{ user, logOut }}
            />
            <Stack.Screen
              name='Update'
              component={Update}
              initialParams={{ user }}
            />
          </>
        ) : (
          <Stack.Screen
            name='Login'
            component={Login}
            initialParams={{ updateUser }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}