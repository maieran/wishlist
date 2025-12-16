import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as SecureStore from "expo-secure-store";
import { apiPost } from "../api/api";
import { ApiError } from "../api/api"; // Pfad anpassen, falls nötig
import { SafeAreaView } from "react-native-safe-area-context";


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const data = await apiPost("/api/auth/login", { username, password });

      await SecureStore.setItemAsync("token", data.token);
      //navigation.replace("Home");
      navigation.replace("Between");

    } catch (err: any) {
      console.log("Login error:", err);

      if (err instanceof ApiError) {
        if (err.status === 404) {
          Alert.alert("Login fehlgeschlagen", "Benutzername existiert nicht.");
          return;
        }

        if (err.status === 401) {
          Alert.alert("Login fehlgeschlagen", "Passwort ist falsch.");
          return;
        }

        Alert.alert("Serverfehler", err.message || "Unbekannter Fehler.");
        return;
      }

      // Falls mal was ganz anderes schiefgeht (Netzwerk, JS-Fehler etc.)
      Alert.alert("Serverfehler", "Der Server konnte nicht erreicht werden.");
    }
  }



  return (
    <SafeAreaView style={{ padding: 20 }}>
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
    </SafeAreaView>
  );
}
