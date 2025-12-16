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
  fetchMatchingConfig,
  adminSetMatchingDate,
  adminClearMatchingDate,
} from "../api/settings";

import { apiGet } from "../api/api";
import { MatchingStatusContext } from "../context/MatchingStatusContext";
import { adminRerunMatching } from "../api/matching";

type Props = NativeStackScreenProps<RootStackParamList, "MatchingDate">;

export default function MatchingDateScreen({ navigation }: Props) {
  const {
    refresh,
    scheduledDate,
    executed,
    dirty,
    lastRunAt,
  } = useContext(MatchingStatusContext);

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [matchingIso, setMatchingIso] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [countdown, setCountdown] = useState("");

  // ------------------------------------
  // LOAD ADMIN FLAG
  // ------------------------------------
  useEffect(() => {
    async function loadMe() {
      const me = await apiGet("/api/auth/me");
      setIsAdmin(!!me.admin);
    }
    loadMe();
  }, []);

  // ------------------------------------
  // LOAD MATCHING CONFIG
  // ------------------------------------
  async function loadDate() {
    setLoading(true);
    try {
      const res = await fetchMatchingConfig();
      setMatchingIso(res.matchDate ?? null);
      setSelectedDate(res.matchDate ? new Date(res.matchDate) : null);
    } catch (e) {
      console.log("loadDate error", e);
    } finally {
      setLoading(false);
    }
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
      const diff = new Date(matchingIso).getTime() - Date.now();

      if (diff <= 0) {
        setCountdown("🎄 Matching läuft oder wurde ausgeführt");
        return;
      }

      const sec = Math.floor(diff / 1000);
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;

      setCountdown(`${d} Tage ${h} Std ${m} Min ${s} Sek`);
    }, 1000);

    return () => clearInterval(id);
  }, [matchingIso]);

  // ------------------------------------
  // SAVE
  // ------------------------------------
  async function onSave() {
    if (!selectedDate) {
      Alert.alert("Fehler", "Bitte Datum auswählen");
      return;
    }

    try {
      await adminSetMatchingDate(selectedDate.toISOString());
      Alert.alert("Gespeichert", "Matching-Datum gesetzt");

      await loadDate();
      refresh();
    } catch {
      Alert.alert("Fehler", "Konnte Datum nicht speichern");
    }
  }

  // ------------------------------------
  // CLEAR
  // ------------------------------------
  async function onClear() {
    try {
      await adminClearMatchingDate();

      setMatchingIso(null);
      setSelectedDate(null);

      Alert.alert("Gelöscht", "Matching-Datum entfernt");
      refresh();
    } catch {
      Alert.alert("Fehler", "Konnte Datum nicht löschen");
    }
  }

  // ------------------------------------
  // UI
  // ------------------------------------
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
          <Text>Geplantes Matching:</Text>
          <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
            {matchingIso}
          </Text>
        </>
      ) : (
        <Text style={{ marginBottom: 20 }}>
          Noch kein Matching-Datum gesetzt.
        </Text>
      )}

      {countdown !== "" && (
        <>
          <Text style={{ fontSize: 18 }}>Countdown:</Text>
          <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
            {countdown}
          </Text>
        </>
      )}

      {/* ================= ADMIN STATUS PANEL ================= */}
      {isAdmin && (
        <View
          style={{
            marginTop: 30,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#f4f4f4",
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            📊 Admin-Status
          </Text>

          <Text>📅 Geplant: {matchingIso ? "Ja" : "Nein"}</Text>
          <Text>✅ Ausgeführt: {executed ? "Ja" : "Nein"}</Text>
          <Text>⚠️ Veraltet: {dirty ? "Ja" : "Nein"}</Text>

          {lastRunAt && (
            <Text style={{ marginTop: 4 }}>
              🕒 Letzter Lauf:{" "}
              {new Date(lastRunAt).toLocaleString("de-DE")}
            </Text>
          )}

          {executed && dirty && (
            <View style={{ marginTop: 12 }}>
              <Button
                title="🔄 Matching neu ausführen"
                color="#8B0000"
                onPress={async () => {
                  await adminRerunMatching();
                  refresh();
                }}
              />
            </View>
          )}
        </View>
      )}


      {/* ================= ADMIN CONTROLS ================= */}
      {isAdmin && (
        <>
          <View style={{ height: 20 }} />

          <Button title="Datum wählen" onPress={() => setShowPicker(true)} />

          {showPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, date) => {
                if (date) setSelectedDate(date);
                if (Platform.OS !== "ios") setShowPicker(false);
              }}
            />
          )}

          {Platform.OS === "ios" && showPicker && (
            <View style={{ marginTop: 10 }}>
              <Button title="Fertig" onPress={() => setShowPicker(false)} />
            </View>
          )}

          <View style={{ height: 15 }} />
          <Button title="Matching speichern" onPress={onSave} />
          <View style={{ height: 10 }} />
          <Button title="Matching löschen" color="red" onPress={onClear} />
        </>
      )}
    </View>
  );
}
