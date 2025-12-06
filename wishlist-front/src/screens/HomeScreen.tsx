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
    async function load() {
      try {
        const me: MeResponse = await apiGet("/api/auth/me");
        setIsAdmin(!!me.admin);
      } catch (e) {
        console.log("Error loading /api/auth/me", e);
      }
    }
    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Silent Santa 🎅</Text>

      <Button title="Meine Wishlist" onPress={() => navigation.navigate("Wishlist")} />
      <View style={{ height: 10 }} />
      <Button title="Mein Team" onPress={() => navigation.navigate("Team")} />
      <View style={{ height: 10 }} />
      {/* <Button title="Team erstellen" onPress={() => navigation.navigate("TeamCreate")} />
      <View style={{ height: 10 }} />*/
      <Button title="Team beitreten" onPress={() => navigation.navigate("TeamJoin")} /> }

      {isAdmin && (
        <>
          <View style={{ height: 30 }} />
          <Text style={{ fontSize: 20 }}>Admin Area</Text>
          <Button
            title="Admin Dashboard"
            onPress={() => navigation.navigate("AdminDashboard")}
          />
        </>
      )}
    </View>
  );
}
