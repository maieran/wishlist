import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { generateSilentSantaMatching } from "../utils/matching";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "MatchingProgress"
>;

export default function MatchingInProgressScreen({
  route,
  navigation,
}: Props) {
  const { teamId } = route.params;

  useEffect(() => {
    const members = ["1", "2", "3", "4"];
    const matching = generateSilentSantaMatching(members);

    const myUserId = "1"; // simuliert
    const partnerId = matching[myUserId];

    setTimeout(() => {
      navigation.replace("MyPartner", { teamId, partnerId });
    }, 1500);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Creating perfect matches… 🎁
      </Text>
    </View>
  );
}
