import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../screens/LandingScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen'
import WishListScreen from '../screens/WishlistScreen';
import AddItemScreen from '../screens/AddItemScreen';
import EditItemScreen from '../screens/EditItemScreen';
import TeamScreen from '../screens/TeamScreen';
import MatchingInProgressScreen from '../screens/MatchingInProgressScreen';
import MyPartnerScreen from '../screens/MyPartnerScreen';
import PartnerWishlistScreen from '../screens/MyPartnerWishlistScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Landing" component={LandingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Wishlist" component={WishListScreen} />
                <Stack.Screen name="AddItem" component={AddItemScreen} />
                <Stack.Screen name="EditItem" component={EditItemScreen} />
                <Stack.Screen name="Team" component={TeamScreen} />
                <Stack.Screen name="MatchingProgress" component={MatchingInProgressScreen} />
                <Stack.Screen name="MyPartner" component={MyPartnerScreen} />
                <Stack.Screen name="PartnerWishlist" component={PartnerWishlistScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}