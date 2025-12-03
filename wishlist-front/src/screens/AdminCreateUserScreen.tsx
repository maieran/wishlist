import React, { useState } from "react";
import { View, Text, TextInput, Switch, Button, Alert } from "react-native";
import { adminCreateUser } from "../api/admin";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminCreateUser">;

export default function AdminCreateUserScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!username.trim() || !displayName.trim() || !password.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    try {
      setLoading(true);

      await adminCreateUser({
        username,
        displayName,
        password,
        admin,
      });

      Alert.alert("Success", "User created!");
      navigation.goBack();

    } catch (err: any) {
      console.log("Create user error:", err);
      Alert.alert("Error", "Could not create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Create User</Text>

      <Text>Username</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={username}
        autoCapitalize="none"
        onChangeText={setUsername}
      />

      <Text>Display Name</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Text>Password</Text>
      <TextInput
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Text style={{ marginRight: 10 }}>Admin?</Text>
        <Switch value={admin} onValueChange={setAdmin} />
      </View>

      <Button title={loading ? "Creating..." : "Create"} onPress={submit} disabled={loading} />
    </View>
  );
}
