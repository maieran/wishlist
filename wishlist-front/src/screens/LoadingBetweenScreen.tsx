// src/screens/LoadingBetweenScreen.tsx
import React, { useEffect, useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/types";
import { MatchingStatusContext } from "../context/MatchingStatusContext";

type Props = NativeStackScreenProps<RootStackParamList, "Load">;

export default function LoadingBetweenScreen({ navigation }: Props) {
  const { loading } = useContext(MatchingStatusContext);

  /**
   * Sobald der Context fertig geladen hat,
   * gehen wir garantiert mit frischen Daten
   * in den BetweenScreen.
   */
  useEffect(() => {
    if (!loading) {
      navigation.replace("Between");
    }
  }, [loading, navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator size="large" color="#8B0000" />
      <Text
        style={{
          marginTop: 14,
          fontSize: 16,
          color: "#444",
        }}
      >
        Lade aktuelle Matching-Daten …
      </Text>
    </View>
  );
}
