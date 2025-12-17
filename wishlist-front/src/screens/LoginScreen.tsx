// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import * as SecureStore from "expo-secure-store";
import { apiPost, ApiError } from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const data = await apiPost("/api/auth/login", { username, password });
      await SecureStore.setItemAsync("token", data.token);
      navigation.replace("Between");
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 404) return Alert.alert("Login failed", "User does not exist.");
        if (err.status === 401) return Alert.alert("Login failed", "Incorrect password.");
        return Alert.alert("Server error", err.message || "Unknown error.");
      }
      Alert.alert("Network error", "Server not reachable.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Image
        source={require("../../assets/images/envelop.png")}
        style={styles.envelope}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Leave your wishes here — the system will take care of the rest.
      </Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#931515"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#931515"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F5",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    marginTop: 32,
    fontSize: 36,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#2B2B2B",
    textAlign: "center",
  },

  envelope: {
    marginTop: 28,
    width: 202,
    height: 129,
  },

  description: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#444",
    maxWidth: 280,
  },

  form: {
    marginTop: 36,
    width: "100%",
    gap: 16,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#931515",
    borderRadius: 36,
    paddingHorizontal: 20,
    fontSize: 24,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#931515",
    textAlign: "center", // ✅ zentriert
    backgroundColor: "#F8F6F5",
  },

  button: {
    marginTop: 32,
    width: "100%",
    height: 56,
    borderRadius: 36,
    backgroundColor: "#931515",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 24, // ✅ wie Join the exchange
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
  },
});
