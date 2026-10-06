import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
import AuthNavigator from './AuthNavigator';
import BottomNavigator from './BottomNavigator';
 
const Stack = createNativeStackNavigator();
 
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
      />
 
      <Stack.Screen
        name="App"
        component={BottomNavigator}
      />
    </Stack.Navigator>
  );
}