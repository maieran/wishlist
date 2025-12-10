import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamCreate, apiTeamActivate } from "../api/team";
import { ApiError } from "../api/api";
import * as SecureStore from "expo-secure-store";

type Props = NativeStackScreenProps<RootStackParamList, "TeamCreate">;

export default function TeamCreateScreen({ navigation }: Props) {
  const [name, setName] = useState("");

  async function onCreate() {
    if (!name.trim()) return Alert.alert("Fehler", "Bitte Teamnamen eingeben.");

    try {
      const res = await apiTeamCreate(name.trim());

      await apiTeamActivate(res.teamId);
      await SecureStore.setItemAsync("activeTeamId", String(res.teamId));

      Alert.alert("Team erstellt", `Invite-Code: ${res.inviteCode}`, [
        { text: "OK", onPress: () => navigation.navigate("Team") },
      ]);
    } catch (err: any) {
      if (err instanceof ApiError) {
        Alert.alert("Fehler", err.message || "Team konnte nicht erstellt werden.");
      } else {
        Alert.alert("Fehler", "Server nicht erreichbar.");
      }
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Team erstellen</Text>
      <TextInput
        placeholder="Teamname"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
      />

      <Button title="Erstellen" onPress={onCreate} />
    </View>
  );
}
