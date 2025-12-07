import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, Share } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamLeave, apiTeamMe} from "../api/team";
import { apiGet } from "../api/api";
import { useIsFocused } from "@react-navigation/native";
import { ApiError, apiPost } from "../api/api";
import * as Clipboard from "expo-clipboard";


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
      ownerId: number;
      members: TeamMember[];
    };

export default function TeamScreen({ navigation }: Props) {
  const [team, setTeam] = useState<TeamMeResponse | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const isFocused = useIsFocused();
  
  async function onKick(userId: number) {
    try {
      await apiPost(`/api/team/kick/${userId}`, {});
      Alert.alert("Erfolgreich", "Mitglied wurde entfernt.");
      navigation.navigate("Home");
    } catch (err: any) {
      if (err instanceof ApiError) {
        Alert.alert("Fehler", err.message);
        return;
      }
      Alert.alert("Serverfehler", "Konnte Mitglied nicht entfernen.");
    }
  }

  function confirmKick(userId: number, displayName: string) {
    Alert.alert(
      "Mitglied entfernen",
      `Willst du ${displayName} wirklich aus dem Team entfernen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        { 
          text: "Entfernen",
          style: "destructive",
          onPress: () => onKick(userId)
        }
      ]
    );
  }

  async function onDeleteTeam() {
    Alert.alert(
      "Team auflösen",
      "Willst du dieses Team wirklich dauerhaft löschen? Das kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await apiPost("/api/team/delete", {});
              Alert.alert("Erfolg", "Team wurde erfolgreich aufgelöst.");
              navigation.navigate("Home");
            } catch (err: any) {
              if (err instanceof ApiError) {
                Alert.alert("Fehler", err.message);
                return;
              }
              Alert.alert("Serverfehler", "Team konnte nicht gelöscht werden.");
            }
          }
        }
      ]
    );
  }



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

  async function copyInviteCode() {
    if (!team || !team.hasTeam) return;
    await Clipboard.setStringAsync(team.inviteCode);
    Alert.alert("Kopiert", "Der Einladungscode wurde in die Zwischenablage kopiert.");
  }

  async function shareInviteCode() {
    if (!team || !team.hasTeam) return;
    await Share.share({
      message: `Tritt meinem Team bei! Einladungscode: ${team.inviteCode}`
    });
  }


  useEffect(() => {
    async function load() {

      const me = await apiGet("/api/auth/me");
      setMyUserId(me.userId);

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
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 10 }}>
        {team.name}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 6 }}>
        Einladungscode: {team.inviteCode}
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <Button title="Code kopieren" onPress={copyInviteCode} />
        <Button title="Teilen" onPress={shareInviteCode} />
      </View>

      <Text style={{ marginTop: 10, marginBottom: 6, fontSize: 18, fontWeight: "500" }}>
        Mitglieder
      </Text>
      <FlatList
        data={team.members}
        keyExtractor={(m) => String(m.userId)}
        
        renderItem={({ item }) => (
          <View style={{ 
            flexDirection: "row",
            justifyContent: "space-between", 
            alignItems: "center",
            paddingVertical: 6,
            }}>

            <Text style={{ fontSize: 16 }}>
              {item.displayName} ({item.username})
            </Text>

            {item.userId === team.ownerId && (
              <Text style={{ marginLeft: 8, color: "gold", fontWeight: "bold" }}>
                👑 Owner
              </Text>
            )}

            {team.owner && item.userId !== myUserId && (
              <Button
                title="Kick"
                color="red"
                onPress={() => confirmKick(item.userId, item.displayName)}
              />
            )}

          </View>
        )}
      />

      {/* // Nur User kann das Team verlassen */}
      {!team.owner && (
      <View style={{ marginTop: 20 }}>
        <Button
          title="Team verlassen"
          color="red"
          onPress={onLeave}
        />
      </View>)}

      {/* // Owner kann ein scheiß machen, außer seine Teams zu löschen  */}
      {team.owner && (
      <View style={{ marginTop: 20 }}>
        <Button
          title="Team auflösen"
          color="red"
          onPress={() =>
            Alert.alert(
              "Team auflösen",
              "Bist du sicher? Dies kann nicht rückgängig gemacht werden!",
              [
                { text: "Abbrechen" },
                {
                  text: "Team löschen",
                  style: "destructive",
                  onPress: onDeleteTeam
                }
              ]
            )
          }
        />
      </View>)}
    </View>
  );
}
