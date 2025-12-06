import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { adminRunMatching } from "../api/admin";

type Props = NativeStackScreenProps<RootStackParamList, "AdminDashboard">;

export default function AdminDashboardScreen({ navigation }: Props) {
  async function runMatchingNow() {
    try {
      await adminRunMatching();
      Alert.alert("Erfolg", "Matching wurde manuell ausgeführt!");
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Matching konnte nicht ausgeführt werden");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Admin Dashboard</Text>

      {/* Dein bestehender Code */}
      <Button
        title="Matching Datum konfigurieren"
        onPress={() => navigation.navigate("MatchingDate")}
      />
      <View style={{ height: 10 }} />
      <Button
        title="User verwalten"
        onPress={() => navigation.navigate("AdminUsers")}
      />
      <View style={{ height: 10 }} />
      <Button
        title="Matching JETZT ausführen"
        color="red"
        onPress={runMatchingNow}
      />

      {/* ───────────────────────────── */}
      {/*      🔥 NEUE TEAM-SECTION     */}
      {/* ───────────────────────────── */}

      <View style={{ height: 30 }} />
      <Text style={{ fontSize: 20 }}>Team Verwaltung</Text>

      <Button
        title="Team erstellen"
        onPress={() => navigation.navigate("TeamCreate")}
      />
      <View style={{ height: 10 }} />

      <Button
        title="Alle Teams ansehen"
        onPress={() => navigation.navigate("TeamAdminList")}
      />
      <View style={{ height: 10 }} />

      <Button
        title="Benutzer einem Team zuweisen"
        onPress={() => navigation.navigate("TeamAssignUser")}
      />
    </View>
  );
}
