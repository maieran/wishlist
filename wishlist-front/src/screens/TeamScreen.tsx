import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiGet } from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "Team">;

type TeamMember = {
  userId: number;
  displayName: string;
  username: string;
};

export default function TeamScreen() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function load() {
      const data = await apiGet("/api/team/members");
      setMembers(data);
    }
    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Mein Team</Text>

      <FlatList
        data={members}
        keyExtractor={(m) => String(m.userId)}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>
            {item.displayName} ({item.username})
          </Text>
        )}
      />
    </View>
  );
}
