// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabs';
console.log('DEBUG: LoginScreen', !!LoginScreen);
console.log('DEBUG: MainTabs', !!MainTabs);

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // Odstránili sme useSession/isLoading kontrolu,
  // aby sme umožnili Guest Mode. Začíname na Login screen.

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        {/* Prvá obrazovka je LoginScreen, kde sa dá pokračovať bez prihlásenia */}
        <Stack.Screen name="Auth" component={LoginScreen} />
        {/* Po prihlásení / kliknutí na "Pokračovať bez" sa navigujeme sem */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}