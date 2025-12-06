import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { apiGet, apiPost } from "../api/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "TeamAssignUser">;

type User = {
  id: number;
  username: string;
  displayName: string;
};

export default function TeamAssignUserScreen({ route, navigation }: Props) {
  const { teamId } = route.params;
  const [users, setUsers] = useState<User[]>([]);

  async function loadUsers() {
    const data = await apiGet("/api/admin/users/all");
    setUsers(data);
  }

  async function assign(userId: number) {
    try {
      await apiPost(`/api/team/admin/assign/${teamId}/${userId}`, {});
      Alert.alert("Erfolg", "Benutzer wurde dem Team zugewiesen");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Fehler", "Zuweisung fehlgeschlagen");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Benutzer Team #{teamId} zuweisen
      </Text>

      <FlatList
        data={users}
        keyExtractor={(u) => String(u.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.displayName}</Text>
            <Text>{item.username}</Text>

            <Button title="Zuweisen" onPress={() => assign(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
