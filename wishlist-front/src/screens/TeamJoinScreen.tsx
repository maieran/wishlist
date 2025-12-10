import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamJoin, apiTeamActivate } from "../api/team";
import * as SecureStore from "expo-secure-store";

type Props = NativeStackScreenProps<RootStackParamList, "TeamJoin">;

export default function TeamJoinScreen({ navigation }: Props) {
  const [code, setCode] = useState("");

  async function onJoin() {
    if (!code.trim()) return Alert.alert("Fehler", "Bitte Einladungs-Code eingeben.");

    try {
      const res = await apiTeamJoin(code.trim());

      await apiTeamActivate(res.teamId);
      await SecureStore.setItemAsync("activeTeamId", String(res.teamId));

      Alert.alert("Erfolg", "Du bist dem Team beigetreten.", [
        { text: "OK", onPress: () => navigation.navigate("Team") },
      ]);
    } catch (err: any) {
      if (err?.status === 404) return Alert.alert("Fehler", "Invite-Code ungültig.");
      if (err?.status === 409) return Alert.alert("Fehler", "Du bist bereits in diesem Team.");
      Alert.alert("Fehler", "Beitritt fehlgeschlagen.");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Team beitreten</Text>

      <TextInput
        placeholder="Invite Code"
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
      />

      <Button title="Beitreten" onPress={onJoin} />
    </View>
  );
}
