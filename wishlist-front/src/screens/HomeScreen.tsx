// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiGet } from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type MeResponse = {
  userId: number;
  displayName: string;
  admin: boolean;
};

export default function HomeScreen({ navigation }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadMe() {
      try {
        const me: MeResponse = await apiGet("/api/auth/me");
        setIsAdmin(!!me.admin);
      } catch (e) {
        console.log("Error loading /api/auth/me", e);
      }
    }
    loadMe();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
      {isAdmin && (
        <Button
          title="Admin Dashboard"
          onPress={() => navigation.navigate("AdminDashboard")}
        />
      )}


      <Text style={{ fontSize: 26, marginTop: 20 }}>🎁 Wishlist App</Text>
      <Button title="Meine Wishlist" onPress={() => navigation.navigate("Wishlist")} />

      <Button title="Silent Santa" onPress={() => navigation.navigate("MatchingProgress")}/>
    </View>
  );
}
