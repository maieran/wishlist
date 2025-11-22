import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Team">;

export default function TeamScreen({ route, navigation }: Props) {
  const { teamId } = route.params;

  const isAdmin = true;

  const teamMembers = [
    { id: "1", name: "André" },
    { id: "2", name: "Maria" },
    { id: "3", name: "John" },
    { id: "4", name: "Sarah" },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>
        SilentSanta Team 🎅
      </Text>

      <Text>Team ID: {teamId}</Text>

      <Text style={{ marginTop: 10, marginBottom: 10 }}>Members:</Text>
      {teamMembers.map((m) => (
        <Text key={m.id}>• {m.name}</Text>
      ))}

      <View style={{ marginTop: 40 }}>
        {isAdmin && (
          <Button
            title="Start Matching"
            onPress={() =>
              navigation.navigate("MatchingProgress", { teamId })
            }
          />
        )}

        {!isAdmin && (
          <Text>Waiting for admin to start matching…</Text>
        )}
      </View>
    </View>
  );
}
