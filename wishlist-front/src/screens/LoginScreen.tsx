import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as SecureStore from "expo-secure-store";
import { apiPost } from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const data = await apiPost("/api/auth/login", { username, password });

      if (!data || !data.token) {
        Alert.alert("Login failed", "Invalid username or password");
        return;
      }

      await SecureStore.setItemAsync("token", data.token);

      navigation.replace("Home");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not connect to backend.");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>Login</Text>

      <Text>Username</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 15 }}
        value={username}
        onChangeText={setUsername}
      />

      <Text>Password</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 15 }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />
    </View>
  );
}
