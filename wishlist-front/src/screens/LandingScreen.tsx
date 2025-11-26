import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Silent Santa</Text>

      <Image
        source={require("../../assets/images/santa-team.jpg")}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.text}>
        Willkommen! 🎄{"\n"}
        Starte jetzt mit Silent Santa.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Weiter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 20,
  },
  image: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: "#eee"
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#b30000",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
