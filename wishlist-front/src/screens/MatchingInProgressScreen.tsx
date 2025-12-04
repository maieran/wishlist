import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { generateSilentSantaMatching } from "../utils/matching";
import { apiGet } from "../api/api";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "MatchingProgress"
>;

export default function MatchingInProgressScreen() {
  const [date, setDate] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    async function load() {
      const cfg = await apiGet("/api/matching/config");

      if (cfg.matchDate) {
        setDate(cfg.matchDate);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!date) return;

    const target = new Date(date).getTime();

    const id = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("🎅 Matching läuft oder wurde ausgeführt!");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(id);
  }, [date]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Silent Santa 🎅</Text>

      {!date && <Text>Noch kein Matching geplant.</Text>}
      {date && (
        <>
          <Text>Matching findet statt am:</Text>
          <Text style={{ fontWeight: "bold" }}>{date}</Text>

          <Text style={{ marginTop: 20, fontSize: 22 }}>{countdown}</Text>
        </>
      )}
    </View>
  );
}
