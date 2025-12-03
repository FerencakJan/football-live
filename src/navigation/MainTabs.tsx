// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Ikony pre prehľadnosť
import HomeScreen from '../screens/HomeScreen';
import MatchDetail from '../screens/MatchDetail';
import ProfileScreen from '../screens/ProfileScreen';
console.log('DEBUG MainTabs: HomeStackScreen ->', !!HomeStackScreen);
console.log('DEBUG MainTabs: HomeScreen ->', !!HomeScreen);
console.log('DEBUG MainTabs: MatchDetail ->', !!MatchDetail);
console.log('DEBUG MainTabs: ProfileScreen ->', !!ProfileScreen);

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Domovský stoh pre detail zápasu
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Live Matches" component={HomeScreen} />
      <HomeStack.Screen name="MatchDetail" component={MatchDetail} options={{ title: 'Detail Zápasu' }} />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hlavičku necháme v HomeStackScreen
        tabBarActiveTintColor: '#FF0057', // Ružová pre moderný akcent
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={ProfileScreen} // Používame ProfileScreen na zobrazenie obľúbených
        options={{
          title: 'Obľúbené',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}