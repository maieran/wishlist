import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamLeave, apiTeamMe } from "../api/team";
import { useIsFocused } from "@react-navigation/native";
import { ApiError } from "../api/api";


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
  const isFocused = useIsFocused();


  async function onLeave() {
  try {
    await apiTeamLeave();

    Alert.alert("Team verlassen", "Du hast das Team verlassen.", [
      { text: "OK", onPress: () => navigation.navigate("Home") }
    ]);

  } catch (err: any) {
    console.log("Leave error:", err);

    if (err instanceof ApiError) {

      if (err.status === 409) {
        Alert.alert("Fehler", "Als Owner kannst du das Team nicht verlassen.");
        return;
      }

      if (err.status === 400) {
        Alert.alert("Fehler", "Du bist in keinem Team.");
        return;
      }

      Alert.alert("Fehler", err.message || "Team konnte nicht verlassen werden.");
      return;
    }

    Alert.alert("Fehler", "Keine Verbindung zum Server.");
  }
  }

  useEffect(() => {
    async function load() {
      const res = await apiTeamMe();
      if ("hasTeam" in res) {
        setTeam(res);
      } else {
        setTeam({ hasTeam: true, ...res });
      }
    }

    if (isFocused) {
      load();
    }
  }, [isFocused]);


  if (!team) {
    return <Text style={{ padding: 20 }}>Lädt Team...</Text>;
  }

  if (!team.hasTeam) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Du bist noch in keinem Team.</Text>
        {/* <Button title="Team erstellen" onPress={() => navigation.navigate("TeamCreate")} />
        <Button title="Team beitreten" onPress={() => navigation.navigate("TeamJoin")} /> */}
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

      <View style={{ marginTop: 20 }}>
        <Button
          title="Team verlassen"
          color="red"
          onPress={onLeave}
        />
      </View>


    </View>
  );
}
