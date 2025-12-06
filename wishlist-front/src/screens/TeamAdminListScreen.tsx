import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { apiGet } from "../api/api";
import { apiDeleteTeam } from "../api/team";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "TeamAdminList">;

type Team = {
  id: number;
  name: string;
  inviteCode: string;
  ownerName: string;
  memberCount: number;
};

export default function TeamAdminListScreen({ navigation }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);

  async function loadTeams() {
    const data = await apiGet("/api/team/admin/all");
    setTeams(data);
  }

  useEffect(() => {
    loadTeams();
  }, []);

  function deleteTeam(teamId: number) {
    Alert.alert(
      "Team löschen?",
      "Das Team wird unwiderruflich gelöscht!",
      [
        { text: "Abbrechen" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            await apiDeleteTeam(teamId);
            loadTeams();
          }
        }
      ]
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Alle Teams</Text>

      <FlatList
        data={teams}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>Invite: {item.inviteCode}</Text>
            <Text>Owner: {item.ownerName}</Text>
            <Text>Mitglieder: {item.memberCount}</Text>

            <View style={{ height: 10 }} />

            <Button
              title="User zuweisen"
              onPress={() =>
                navigation.navigate("TeamAssignUser", { teamId: item.id })
              }
            />

            <View style={{ height: 5 }} />

            <Button
              title="Team löschen"
              color="red"
              onPress={() => deleteTeam(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}
