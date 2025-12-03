import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { adminFetchUsers, adminDeleteUser } from "../api/admin";

type Props = NativeStackScreenProps<RootStackParamList, "AdminUsers">;

export default function AdminUsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const data = await adminFetchUsers();
    setUsers(data);
    setLoading(false);
  }

  // Load when screen opens
  useEffect(() => {
    load();

    // Also reload every time screen becomes focused again
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  async function handleDelete(id: number) {
    await adminDeleteUser(id);
    load(); // immediately reload list
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Admin – Users</Text>

      <Button
        title="Create New User"
        onPress={() => navigation.navigate("AdminCreateUser")}
      />

      {loading && <Text style={{ marginTop: 20 }}>Loading...</Text>}

      <FlatList
        style={{ marginTop: 20 }}
        data={users}
        keyExtractor={(u) => String(u.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AdminEditUser", { userId: item.id })
            }
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.displayName} ({item.username})
            </Text>
            <Text>Role: {item.admin ? "Admin" : "User"}</Text>

            <Button
              title="Delete"
              color="red"
              onPress={() => handleDelete(item.id)}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
