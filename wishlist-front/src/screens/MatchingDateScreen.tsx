import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { fetchMatchingDate, adminSetMatchingDate, adminClearMatchingDate } from "../api/settings";
import { apiGet } from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "MatchingDate">;

type MeResponse = {
  userId: number;
  displayName: string;
  admin: boolean;
};



export default function MatchingDateScreen({ navigation }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [matchingIso, setMatchingIso] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [countdown, setCountdown] = useState<string>("");

  // 1) /api/auth/me → Admin flag holen
  useEffect(() => {
    async function loadMe() {
      try {
        const me: MeResponse = await apiGet("/api/auth/me");
        setIsAdmin(!!me.admin);
      } catch (e) {
        console.log("Error loading /api/auth/me", e);
      }
    }
    loadMe();
  }, []);

  // 2) Matching Datum laden
  useEffect(() => {
    async function loadDate() {
      try {
        const res = await fetchMatchingDate();
        if (res.dateTime) {
          setMatchingIso(res.dateTime);
          setInputValue(res.dateTime); // für Admin-Input
        } else {
          setMatchingIso(null);
        }
      } catch (e) {
        console.log("Error loading matching date", e);
      }
    }
    loadDate();
  }, []);

  // 3) Countdown
  useEffect(() => {
    if (!matchingIso) {
      setCountdown("");
      return;
    }

    const target = new Date(matchingIso).getTime();

    const id = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("Matching läuft oder wurde bereits ausgeführt 🎅");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown(
        `${pad(days)} Tage ${pad(hours)} Stunden ${pad(minutes)} Minuten ${pad(
          seconds
        )} Sekunden`
      );
    }, 1000);

    return () => clearInterval(id);
  }, [matchingIso]);

  function pad(n: number) {
    return n.toString().padStart(2, "0");
  }

  async function onSave() {
    try {
      // Sehr simpel: Admin tippt ISO Datetime (z.B. 2025-12-19T18:00:00Z)
      // Später ersetzen wir das durch einen richtigen DateTimePicker
      const d = new Date(inputValue);
      if (isNaN(d.getTime())) {
        Alert.alert("Fehler", "Bitte gültiges ISO-Datum eingeben (z.B. 2025-12-19T18:00:00Z)");
        return;
      }

      const iso = d.toISOString();
      await adminSetMatchingDate(iso);
      setMatchingIso(iso);
      Alert.alert("Gespeichert", "Matching-Datum wurde gesetzt.");
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Konnte Matching-Datum nicht speichern.");
    }
  }

  async function onClear() {
    try {
      await adminClearMatchingDate();
      setMatchingIso(null);
      setInputValue("");
      Alert.alert("Ok", "Matching-Datum gelöscht.");
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Konnte Matching-Datum nicht löschen.");
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "flex-start" }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Silent Santa Datum</Text>

      {matchingIso ? (
        <Text style={{ marginBottom: 10 }}>
          Geplantes Matching:{"\n"}
          <Text style={{ fontWeight: "bold" }}>{matchingIso}</Text>
        </Text>
      ) : (
        <Text style={{ marginBottom: 10 }}>
          Noch kein Matching-Datum gesetzt.
        </Text>
      )}

      {countdown !== "" && (
        <Text style={{ marginBottom: 20 }}>
          Bis zum Matching verbleiben:{"\n"}
          <Text style={{ fontWeight: "bold" }}>{countdown}</Text>
        </Text>
      )}

      {!matchingIso && countdown === "" && (
        <Text style={{ marginBottom: 20 }}>
          Sobald ein Admin ein Datum setzt, erscheint hier ein Countdown 🎄
        </Text>
      )}

      {/* Admin-Bereich */}
      {isAdmin && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 18, marginBottom: 6 }}>Admin – Datum setzen</Text>
          <Text style={{ marginBottom: 6 }}>
            ISO-Datum eingeben, z.B.:{"\n"}
            2025-12-19T18:00:00Z
          </Text>

          <TextInput
            placeholder="2025-12-19T18:00:00Z"
            value={inputValue}
            onChangeText={setInputValue}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              marginBottom: 10,
            }}
          />

          <Button title="Matching-Datum speichern" onPress={onSave} />
          <View style={{ height: 10 }} />
          <Button title="Matching-Datum löschen" color="red" onPress={onClear} />
        </View>
      )}
    </View>
  );
}
