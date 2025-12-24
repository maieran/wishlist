import React, { useEffect, useState } from "react";
import { Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamCreate, apiTeamActivate } from "../api/team";
import { ApiError, apiGet } from "../api/api";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "TeamCreate">;

export default function TeamCreateScreen({ navigation }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    apiGet("/api/auth/me").then((me) => {
      if (!me.admin) {
        Alert.alert(
          "Nicht erlaubt",
          "Nur Admins dürfen Teams erstellen."
        );
        navigation.goBack();
      }
    });
  }, []);

  async function onCreate() {
    if (!name.trim()) {
      Alert.alert("Fehler", "Bitte Teamnamen eingeben.");
      return;
    }

    try {
      const res = await apiTeamCreate(name.trim());
      await apiTeamActivate(res.teamId);
      await SecureStore.setItemAsync(
        "activeTeamId",
        String(res.teamId)
      );

      Alert.alert("Team erstellt", `Invite-Code: ${res.inviteCode}`, [
        { text: "OK", onPress: () => navigation.navigate("Team") },
      ]);
    } catch (err: any) {
      if (err instanceof ApiError) {
        Alert.alert("Fehler", err.message);
      } else {
        Alert.alert("Fehler", "Server nicht erreichbar.");
      }
    }
  }

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Team erstellen
      </Text>

      <TextInput
        placeholder="Teamname"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 10,
        }}
      />

      <Button title="Erstellen" onPress={onCreate} />
    </SafeAreaView>
  );
}
