import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamCreate } from "../api/team";

type Props = NativeStackScreenProps<RootStackParamList, "TeamCreate">;

export default function TeamCreateScreen({ navigation }: Props) {
  const [name, setName] = useState("");

  async function onCreate() {
    if (!name.trim()) {
      Alert.alert("Fehler", "Bitte Teamnamen eingeben.");
      return;
    }

    try {
      const res = await apiTeamCreate(name.trim());
      Alert.alert(
        "Team erstellt",
        `Invite Code: ${res.inviteCode}`,
        [{ text: "OK", onPress: () => navigation.navigate("Team") }]
      );
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Team konnte nicht erstellt werden.");
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
