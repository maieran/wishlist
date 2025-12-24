// src/screens/TeamScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, Share } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import {
  apiTeamDetails,
  apiTeamLeave,
  apiTeamKick,
  apiTeamDelete,
} from "../api/team";
import { apiGet } from "../api/api";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Team">;

type TeamMember = {
  userId: number;
  username: string;
  displayName: string;
};

type TeamMeResponse = {
  id: number;
  name: string;
  inviteCode: string;
  isOwner: boolean;
  ownerId: number | null;
  members: TeamMember[];
};

export default function TeamScreen({ navigation }: Props) {
  const [team, setTeam] = useState<TeamMeResponse | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const isFocused = useIsFocused();

  // ------------------------------------------------
  // Header Buttons (Create nur für Admin)
  // ------------------------------------------------
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !hasTeam ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {isAdmin && (
              <Button
                title="+"
                onPress={() => navigation.navigate("TeamCreate")}
              />
            )}
            <Button
              title="Join"
              onPress={() => navigation.navigate("TeamJoin")}
            />
          </View>
        ) : null,
    });
  }, [navigation, hasTeam, isAdmin]);

  // ------------------------------------------------
  // Load Team + User
  // ------------------------------------------------
  useEffect(() => {
    async function load() {
      const active = await SecureStore.getItemAsync("activeTeamId");

      const me = await apiGet("/api/auth/me");
      if (!me) {
        setHasTeam(false);
        setTeam(null);
        return;
      }

      setMyUserId(me.id);
      setIsAdmin(me.admin === true);

      if (!active) {
        setHasTeam(false);
        setTeam(null);
        return;
      }

      try {
        const res = await apiTeamDetails(Number(active));
        setTeam(res);
        setHasTeam(true);
      } catch {
        setTeam(null);
        setHasTeam(false);
      }
    }

    if (isFocused) load();
  }, [isFocused]);

  // ------------------------------------------------
  // Actions
  // ------------------------------------------------
  async function copyInviteCode() {
    if (!team) return;
    await Clipboard.setStringAsync(team.inviteCode);
    Alert.alert("Kopiert", "Der Einladungscode wurde kopiert.");
  }

  async function shareInviteCode() {
    if (!team) return;
    await Share.share({
      message: `Tritt meinem Team bei! Einladungscode: ${team.inviteCode}`,
    });
  }

  async function refreshTeam() {
    const active = await SecureStore.getItemAsync("activeTeamId");
    if (!active) return;
    const updated = await apiTeamDetails(Number(active));
    setTeam(updated);
  }

  async function onKick(userId: number) {
    if (!team) return;

    try {
      await apiTeamKick(team.id, userId);
      await refreshTeam();
      Alert.alert("Erfolg", "Mitglied wurde entfernt.");
    } catch (err: any) {
      Alert.alert("Fehler", err.message || "Kick fehlgeschlagen.");
    }
  }

  function confirmKick(userId: number, displayName: string) {
    Alert.alert(
      "Mitglied entfernen",
      `Willst du ${displayName} wirklich entfernen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Entfernen",
          style: "destructive",
          onPress: () => onKick(userId),
        },
      ]
    );
  }

  async function onDeleteTeam() {
    if (!team) return;

    Alert.alert(
      "Team löschen",
      "Willst du dieses Team wirklich dauerhaft löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await apiTeamDelete(team.id);
              await SecureStore.deleteItemAsync("activeTeamId");
              Alert.alert("Gelöscht", "Team wurde gelöscht.");
              navigation.navigate("TeamList");
            } catch (err: any) {
              Alert.alert("Fehler", err.message || "Löschen fehlgeschlagen.");
            }
          },
        },
      ]
    );
  }

  async function onLeave() {
    if (!team) return;

    try {
      await apiTeamLeave(team.id);
      await SecureStore.deleteItemAsync("activeTeamId");
      Alert.alert("Team verlassen", "Du hast das Team verlassen.", [
        { text: "OK", onPress: () => navigation.navigate("TeamList") },
      ]);
    } catch (err: any) {
      Alert.alert("Fehler", err.message || "Verlassen fehlgeschlagen.");
    }
  }

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  if (!hasTeam) {
    return (
      <SafeAreaView style={{ padding: 20 }}>
        <Text style={{ marginBottom: 10 }}>
          Kein aktives Team ausgewählt.
        </Text>
        <Button
          title="Meine Teams"
          onPress={() => navigation.navigate("TeamList")}
        />
      </SafeAreaView>
    );
  }

  if (!team) {
    return <Text style={{ padding: 20 }}>Lädt Team...</Text>;
  }

  return (
    <SafeAreaView style={{ padding: 20 }}>
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

      <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 6 }}>
        Mitglieder
      </Text>

      <FlatList
        data={team.members}
        keyExtractor={(m) => String(m.userId)}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 6,
            }}
          >
            <Text>
              {item.displayName} ({item.username})
            </Text>

            {item.userId === team.ownerId && (
              <Text style={{ color: "gold" }}>👑 Owner</Text>
            )}

            {team.isOwner && item.userId !== myUserId && (
              <Button
                title="Kick"
                color="red"
                onPress={() =>
                  confirmKick(item.userId, item.displayName)
                }
              />
            )}
          </View>
        )}
      />

      {!team.isOwner && (
        <View style={{ marginTop: 20 }}>
          <Button title="Team verlassen" color="red" onPress={onLeave} />
        </View>
      )}

      {team.isOwner && (
        <View style={{ marginTop: 20 }}>
          <Button title="Team löschen" color="red" onPress={onDeleteTeam} />
        </View>
      )}
    </SafeAreaView>
  );
}
