import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiGet } from "../api/api";
import {
  apiTeamMe,
  apiTeamLeave,
  apiDeleteTeam,
  apiGetTeamDetails
} from "../api/team";

type Props = NativeStackScreenProps<RootStackParamList, "Team">;

export default function TeamScreen({ navigation }: Props) {
  const [team, setTeam] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  async function reload() {
    setLoading(true);

    const me = await apiGet("/api/auth/me");
    setUserIsAdmin(!!me.admin);

    const t = await apiTeamMe();   // returns TeamResponse OR null

    setTeam(t);

    if (t) {
      const full = await apiGetTeamDetails();
      setDetails(full);
    } else {
      setDetails(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    const unsub = navigation.addListener("focus", reload);
    return unsub;
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  // ===========================================
  // FALL A: USER IST IN KEINEM TEAM
  // ===========================================
  if (!team) {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 18 }}>Du bist noch in keinem Team.</Text>

        <Button title="Team beitreten" onPress={() => navigation.navigate("TeamJoin")} />

        {userIsAdmin && (
          <Button title="Team erstellen" onPress={() => navigation.navigate("TeamCreate")} />
        )}
      </View>
    );
  }

  // ===========================================
  // FALL B: USER IST IN EINEM TEAM
  // ===========================================
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{details?.name ?? team.name}</Text>
      <Text>Einladungscode: {details?.inviteCode ?? team.inviteCode}</Text>

      <Text style={{ marginTop: 20, fontSize: 18 }}>Mitglieder:</Text>

      <FlatList
        data={details?.members ?? []}
        keyExtractor={(m) => String(m.userId)}
        renderItem={({ item }) => (
          <Text style={{ paddingVertical: 4 }}>
            {item.username} {item.isAdmin ? "(Admin)" : ""}
          </Text>
        )}
      />

      {/* Team verlassen */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Team verlassen"
          color="#444"
          onPress={() =>
            Alert.alert("Team verlassen?", "", [
              { text: "Abbrechen" },
              {
                text: "Verlassen",
                onPress: async () => {
                  await apiTeamLeave();
                  reload();
                },
              },
            ])
          }
        />
      </View>

      {/* Team löschen — nur Admin */}
      {userIsAdmin && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Team löschen"
            color="red"
            onPress={() =>
              Alert.alert("Team löschen?", "Dies kann nicht rückgängig gemacht werden.", [
                { text: "Abbrechen" },
                {
                  text: "Löschen",
                  style: "destructive",
                  onPress: async () => {
                    await apiDeleteTeam(details?.id ?? team.id); // FIXED
                    navigation.goBack();
                  },
                },
              ])
            }
          />
        </View>
      )}
    </View>
  );
}
