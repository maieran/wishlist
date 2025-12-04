import React from "react";
import { View, Button, Text, Alert } from "react-native";
import { adminRunMatching } from "../api/admin";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminDashboard">;

export default function AdminDashboardScreen({ navigation }: Props) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Admin Dashboard</Text>

      <Button
        title="Userverwaltung"
        onPress={() => navigation.navigate("AdminUsers")}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Silent Santa Datum"
        onPress={() => navigation.navigate("MatchingDate")}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Matching JETZT ausführen"
        color="red"
        onPress={async () => {
          try {
            await adminRunMatching();
            Alert.alert("OK", "Matching wurde erfolgreich ausgeführt!");
          } catch (e) {
            console.log(e);
            Alert.alert("Fehler", "Matching konnte nicht ausgeführt werden.");
          }
        }}
      />
    </View>
  );
}
