// src/screens/MatchingDateScreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

import {
  fetchMatchingDate,
  adminSetMatchingDate,
  adminClearMatchingDate,
} from "../api/settings";
import { apiGet } from "../api/api";
import { MatchingStatusContext } from "../context/MatchingStatusContext";

type Props = NativeStackScreenProps<RootStackParamList, "MatchingDate">;

export default function MatchingDateScreen({ navigation }: Props) {
  const { refresh, executed } = useContext(MatchingStatusContext);

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [matchingIso, setMatchingIso] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [countdown, setCountdown] = useState("");

  // ------------------------------------
  // LOAD USER ADMIN FLAG
  // ------------------------------------
  useEffect(() => {
    async function loadMe() {
      try {
        const me = await apiGet("/api/auth/me");
        setIsAdmin(!!me.admin);
      } catch (e) {
        console.log(e);
      }
    }
    loadMe();
  }, []);

  // ------------------------------------
  // LOAD MATCH DATE
  // ------------------------------------
  async function loadDate() {
    setLoading(true);
    try {
      const res = await fetchMatchingDate();
      if (res?.dateTime) {
        setMatchingIso(res.dateTime);
        setSelectedDate(new Date(res.dateTime));
      } else {
        setMatchingIso(null);
        setSelectedDate(null);
      }
    } catch (e) {
      console.log("loadDate ERROR", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDate();
  }, []);

  // ------------------------------------
  // COUNTDOWN
  // ------------------------------------
  useEffect(() => {
    if (!matchingIso) {
      setCountdown("");
      return;
    }

    const id = setInterval(() => {
      const target = new Date(matchingIso).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("🎅 Matching läuft oder wurde ausgeführt!");
        return;
      }

      const sec = Math.floor(diff / 1000);
      const days = Math.floor(sec / 86400);
      const hours = Math.floor((sec % 86400) / 3600);
      const minutes = Math.floor((sec % 3600) / 60);
      const seconds = sec % 60;

      setCountdown(
        `${days} Tage ${hours} Std ${minutes} Min ${seconds} Sek`
      );
    }, 1000);

    return () => clearInterval(id);
  }, [matchingIso]);

  // ------------------------------------
  // ADMIN SAVE
  // ------------------------------------
  async function onSave() {
    if (!selectedDate) {
      Alert.alert("Fehler", "Bitte ein Datum auswählen.");
      return;
    }

    const iso = selectedDate.toISOString();
    try {
      await adminSetMatchingDate(iso);
      Alert.alert("Gespeichert", "Matching-Datum wurde gesetzt.");

      await loadDate();
      refresh(); // Context aktualisieren

    } catch (e) {
      Alert.alert("Fehler", "Konnte Datum nicht speichern.");
    }
  }

  // ------------------------------------
  // ADMIN CLEAR
  // ------------------------------------
  async function onClear() {
    try {
      await adminClearMatchingDate();
      setSelectedDate(null);
      setMatchingIso(null);

      Alert.alert("Gelöscht", "Matching-Datum entfernt.");
      refresh();
    } catch (e) {
      Alert.alert("Fehler", "Konnte Datum nicht löschen.");
    }
  }

  // ------------------------------------
  // UI
  // ------------------------------------
  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 15 }}>Lade Datum …</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Silent Santa Datum 🎅
      </Text>

      {matchingIso ? (
        <>
          <Text style={{ marginBottom: 10 }}>Geplantes Matching:</Text>
          <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
            {matchingIso}
          </Text>
        </>
      ) : (
        <Text style={{ marginBottom: 20 }}>
          Noch kein Matching-Datum gesetzt.
        </Text>
      )}

      {executed && (
        <Text style={{ color: "green", marginBottom: 15 }}>
          🎄 Matching wurde bereits ausgeführt!
        </Text>
      )}

      {countdown !== "" && (
        <>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Countdown:</Text>
          <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
            {countdown}
          </Text>
        </>
      )}

      {/* ADMIN CONTROLS */}
      {isAdmin && (
        <>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            Admin – Datum auswählen
          </Text>

          {selectedDate && (
            <Text style={{ marginBottom: 10 }}>
              Ausgewählt:
              {"\n"}
              {selectedDate.toISOString()}
            </Text>
          )}

          <Button title="Datum wählen" onPress={() => setShowPicker(true)} />

          {showPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, date) => {
                if (event.type !== "dismissed" && date) {
                  setSelectedDate(date);
                }
                setShowPicker(false);
              }}
            />
          )}

          <View style={{ height: 20 }} />

          <Button title="Matching-Datum speichern" onPress={onSave} />

          <View style={{ height: 10 }} />

          <Button title="Datum löschen" color="red" onPress={onClear} />
        </>
      )}
    </View>
  );
}
