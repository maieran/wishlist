import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamList, apiTeamActivate } from "../api/team";
import * as SecureStore from "expo-secure-store";
import TeamAvatar from "../component/TeamAvatar";

type Props = NativeStackScreenProps<RootStackParamList, "TeamList">;

export default function TeamListScreen({ navigation }: Props) {
  const [teams, setTeams] = useState<any[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // LOAD FUNCTION
  // -----------------------------
  const load = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiTeamList();
      setTeams(res.teams);

      const active = await SecureStore.getItemAsync("activeTeamId");
      setActiveTeamId(active ? Number(active) : null);
    } catch (err) {
      Alert.alert("Fehler", "Teams konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // LOAD AT MOUNT
  // -----------------------------
  useEffect(() => {
    load();
  }, [load]);

  // -----------------------------
  // RELOAD WHEN SCREEN FOCUSES
  // -----------------------------
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  // -----------------------------
  // ACTIVATE TEAM
  // -----------------------------
  async function activateTeam(teamId: number) {
    try {
      await apiTeamActivate(teamId);
      await SecureStore.setItemAsync("activeTeamId", String(teamId));
      setActiveTeamId(teamId);
      navigation.navigate("Team");
    } catch (err) {
      Alert.alert("Fehler", "Team konnte nicht aktiviert werden.");
    }
  }

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Lade Teams...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 20 }}>
        Meine Teams
      </Text>

      <FlatList
        data={teams}
        keyExtractor={(t) => String(t.teamId)}
        renderItem={({ item }) => {
          const isActive = item.teamId === activeTeamId;

          return (
            <TouchableOpacity
              onPress={() => activateTeam(item.teamId)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 15,
                borderWidth: 2,
                borderColor: isActive ? "green" : "#ccc",
                borderRadius: 10,
                marginBottom: 10,
                backgroundColor: isActive ? "#e9ffe9" : "white",
              }}
            >
              {/* TEAM AVATAR */}
              <TeamAvatar url={item.teamAvatarUrl} size={55} />


              {/* TEXT */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  {item.name}
                </Text>

                {isActive && (
                  <Text style={{ color: "green", marginTop: 4 }}>
                    ✔ Aktives Team
                  </Text>
                )}

                {item.ownerId && (
                  <Text style={{ color: "gold", marginTop: 4 }}>
                    👑 Owner ID: {item.ownerId}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Team erstellen"
          onPress={() => navigation.navigate("TeamCreate")}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Team beitreten"
          onPress={() => navigation.navigate("TeamJoin")}
        />
      </View>
    </View>
  );
}
