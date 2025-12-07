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
  teamId: number;
};

export default function HomeScreen({ navigation }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const me: MeResponse = await apiGet("/api/auth/me");
      setIsAdmin(me.admin);
    }
    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Silent Santa 🎅</Text>
      
      {/* <Button 
        title="Silent Santa Matching" 
        onPress={() => navigation.navigate("MatchingProgress")} 
      /> */}
      

      <Button 
        title="Meine Wishlist" 
        onPress={() => navigation.navigate("Wishlist")} 
      />

      <View style={{ height: 10 }} />

      <Button 
        title="Mein Team"
        onPress={() => navigation.navigate("Team")}
      />

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

