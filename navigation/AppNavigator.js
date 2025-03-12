import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ObjectPlacementScreen from '../screens/ObjectPlacement';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="ObjectPlacement" component={ObjectPlacementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}