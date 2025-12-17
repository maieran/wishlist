// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

/* ENTRY */
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";

/* LOADING / BETWEEN */
import LoadingBetweenScreen from "../screens/LoadingBetweenScreen";
import BetweenScreen from "../screens/BetweenScreen";

/* MAIN */
import UserHomeScreen from "../screens/UserHomeScreen";
import RulesScreen from "../screens/RulesScreen";

/* TEAM */
import TeamScreen from "../screens/TeamScreen";
import TeamCreateScreen from "../screens/TeamCreateScreen";
import TeamJoinScreen from "../screens/TeamJoinScreen";
import TeamListScreen from "../screens/TeamListScreen";

/* MATCHING */
import MatchingInProgressScreen from "../screens/MatchingInProgressScreen";
import MatchingDateScreen from "../screens/MatchingDateScreen";
import MyPartnerScreen from "../screens/MyPartnerScreen";
import PartnerWishlistScreen from "../screens/MyPartnerWishlistScreen";

/* ADMIN */
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import AdminUsersScreen from "../screens/AdminUsersScreen";
import AdminCreateUserScreen from "../screens/AdminCreateUserScreen";
import AdminEditUserScreen from "../screens/AdminEditUserScreen";

/* WISHLIST */
import WishListScreen from "../screens/WishlistScreen";
import AddItemScreen from "../screens/AddItemScreen";
import EditItemScreen from "../screens/EditItemScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, // später auf false setzen 👈 wichtig fürs Custom Design
      }}
    >
      {/* ENTRY */}
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* LOADING / POLLING */}
      <Stack.Screen name="Load" component={LoadingBetweenScreen} />
      <Stack.Screen name="Between" component={BetweenScreen} />

      {/* MAIN */}
      <Stack.Screen name="Home" component={UserHomeScreen} />
      <Stack.Screen name="Rules" component={RulesScreen} />

      {/* TEAM */}
      <Stack.Screen name="Team" component={TeamScreen} />
      <Stack.Screen name="TeamCreate" component={TeamCreateScreen} />
      <Stack.Screen name="TeamJoin" component={TeamJoinScreen} />
      <Stack.Screen name="TeamList" component={TeamListScreen} />

      {/* MATCHING */}
      <Stack.Screen name="MatchingProgress" component={MatchingInProgressScreen} />
      <Stack.Screen name="MatchingDate" component={MatchingDateScreen} />
      <Stack.Screen name="MyPartner" component={MyPartnerScreen} />
      <Stack.Screen name="PartnerWishlist" component={PartnerWishlistScreen} />

      {/* ADMIN */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminCreateUser" component={AdminCreateUserScreen} />
      <Stack.Screen name="AdminEditUser" component={AdminEditUserScreen} />

      {/* WISHLIST */}
      <Stack.Screen name="Wishlist" component={WishListScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="EditItem" component={EditItemScreen} />
    </Stack.Navigator>
  );
}
