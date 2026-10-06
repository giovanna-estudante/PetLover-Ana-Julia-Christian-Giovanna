import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
 
const Stack = createNativeStackNavigator();
 
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={Login}
      />
 
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
      />
    </Stack.Navigator>
  );
}