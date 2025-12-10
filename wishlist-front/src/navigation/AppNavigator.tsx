import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./types";

import LandingScreen from "../screens/LandingScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import WishListScreen from "../screens/WishlistScreen";
import AddItemScreen from "../screens/AddItemScreen";
import EditItemScreen from "../screens/EditItemScreen";
import TeamScreen from "../screens/TeamScreen";
import TeamCreateScreen from "../screens/TeamCreateScreen";
import TeamJoinScreen from "../screens/TeamJoinScreen";
import MatchingInProgressScreen from "../screens/MatchingInProgressScreen";
import MyPartnerScreen from "../screens/MyPartnerScreen";
import PartnerWishlistScreen from "../screens/MyPartnerWishlistScreen";
import AdminUsersScreen from "../screens/AdminUsersScreen";
import AdminCreateUserScreen from "../screens/AdminCreateUserScreen";
import AdminEditUserScreen from "../screens/AdminEditUserScreen";
import MatchingDateScreen from "../screens/MatchingDateScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import TeamListScreen from "../screens/TeamListScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
        <Stack.Screen name="AdminCreateUser" component={AdminCreateUserScreen} />
        <Stack.Screen name="AdminEditUser" component={AdminEditUserScreen} />
        <Stack.Screen name="Wishlist" component={WishListScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="EditItem" component={EditItemScreen} />
        <Stack.Screen name="Team" component={TeamScreen} />
        <Stack.Screen name="TeamCreate" component={TeamCreateScreen} />
        <Stack.Screen name="TeamList" component={TeamListScreen} />
        <Stack.Screen name="TeamJoin" component={TeamJoinScreen} />
        <Stack.Screen name="MatchingProgress" component={MatchingInProgressScreen} />
        <Stack.Screen name="MyPartner" component={MyPartnerScreen} />
        <Stack.Screen name="PartnerWishlist" component={PartnerWishlistScreen} />
        <Stack.Screen name="MatchingDate" component={MatchingDateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
