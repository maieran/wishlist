import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import WishListScreen from '../screens/WishlistScreen';
import AddItemScreen from '../screens/AddItemScreen';
import EditItemScreen from '../screens/EditItemScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
                <Stack.Screen name="Wishlist" component={WishListScreen}></Stack.Screen>
                <Stack.Screen name="AddItem" component={AddItemScreen}></Stack.Screen>
                <Stack.Screen name="EditItem" component={EditItemScreen}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}