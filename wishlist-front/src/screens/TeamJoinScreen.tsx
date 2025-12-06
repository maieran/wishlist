import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamJoin } from "../api/team";

type Props = NativeStackScreenProps<RootStackParamList, "TeamJoin">;

export default function TeamJoinScreen({ navigation }: Props) {
  const [code, setCode] = useState("");

  async function onJoin() {
    if (!code.trim()) {
      Alert.alert("Fehler", "Bitte Einladungs-Code eingeben.");
      return;
    }

  try {
    await apiTeamJoin(code.trim());
    Alert.alert("Erfolg", "Du bist dem Team beigetreten.", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Team"),
      },
    ]);
  } catch (e: any) {
    Alert.alert("Fehler", e.message || "Einladungscode ist ungültig.");
  }

  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Team beitreten</Text>
      <TextInput
        placeholder="Invite Code"
        value={code}
        onChangeText={setCode}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
      />
      <Button title="Beitreten" onPress={onJoin} />
    </View>
  );
}
