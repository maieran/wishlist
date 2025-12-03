import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { adminFetchUsers, adminUpdateUser, adminDeleteUser } from "../api/admin";

type Props = NativeStackScreenProps<RootStackParamList, "AdminEditUser">;

export default function AdminEditUserScreen({ route, navigation }: Props) {
  const { userId } = route.params;

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  async function load() {
    const users = await adminFetchUsers();
    const u = users.find((u: any) => u.id === userId);

    if (!u) {
      Alert.alert("Error", "User not found");
      navigation.goBack();
      return;
    }

    setUsername(u.username);
    setDisplayName(u.displayName);
    setAdmin(u.admin);
    setPassword(""); // always empty

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  async function save() {
    try {
      const payload: any = {
        username,
        displayName,
        admin,
      };

      if (password.trim().length > 0) {
        payload.password = password;
      }

      await adminUpdateUser(userId, payload);

      Alert.alert("Success", "User saved");
      navigation.goBack();

    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not update user");
    }
  }

  async function remove() {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await adminDeleteUser(userId);
              Alert.alert("Deleted", "User removed");
              navigation.goBack();
            } catch (e) {
              console.log(e);
              Alert.alert("Error", "Could not delete user");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Edit User</Text>

      <Text>Username</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={username}
        onChangeText={setUsername}
      />

      <Text>Display Name</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Text>New Password (optional)</Text>
      <TextInput
        secureTextEntry
        placeholder="Leave empty to keep current password"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Text>Admin?</Text>
        <Switch value={admin} onValueChange={setAdmin} />
      </View>

      <Button title="Save" onPress={save} />
      <View style={{ height: 12 }} />
      <Button title="Delete User" color="red" onPress={remove} />
    </View>
  );
}
