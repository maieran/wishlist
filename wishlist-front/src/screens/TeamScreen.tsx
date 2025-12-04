import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamMe } from "../api/team";

type Props = NativeStackScreenProps<RootStackParamList, "Team">;

type TeamMember = {
  userId: number;
  username: string;
  displayName: string;
};

type TeamMeResponse =
  | { hasTeam: false }
  | {
      hasTeam: true;
      teamId: number;
      name: string;
      inviteCode: string;
      owner: boolean;
      members: TeamMember[];
    };

export default function TeamScreen({ navigation }: Props) {
  const [team, setTeam] = useState<TeamMeResponse | null>(null);

  useEffect(() => {
    async function load() {
      const res = await apiTeamMe();
      if ("hasTeam" in res) {
        setTeam(res);
      } else {
        // Backend-Response ist TeamMeResponse direkt
        setTeam({ hasTeam: true, ...res });
      }
    }
    load();
  }, []);

  if (!team) {
    return <Text style={{ padding: 20 }}>Lädt Team...</Text>;
  }

  if (!team.hasTeam) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Du bist noch in keinem Team.</Text>
        <Button title="Team erstellen" onPress={() => navigation.navigate("TeamCreate")} />
        <Button title="Team beitreten" onPress={() => navigation.navigate("TeamJoin")} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{team.name}</Text>
      <Text>Einladungscode: {team.inviteCode}</Text>

      <Text style={{ marginTop: 20, fontSize: 18 }}>Mitglieder:</Text>
      <FlatList
        data={team.members}
        keyExtractor={(m) => String(m.userId)}
        renderItem={({ item }) => (
          <Text style={{ padding: 6 }}>
            {item.displayName} ({item.username})
          </Text>
        )}
      />
    </View>
  );
}
