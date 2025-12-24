// src/screens/MatchingDateScreen.tsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MatchingStatusContext } from "../context/MatchingStatusContext";
import {
  adminDeleteMatching,
  adminRunManual,
  adminRerun,
  adminSetMatchingDate,
} from "../api/matching";

export default function MatchingDateScreen() {
  const {
    refresh,
    activeTeamId,
    activeTeamName,
    isAdmin,
    matchDate,
    executed,
    dirty,
    lastRunAt,
  } = useContext(MatchingStatusContext);

  const [now, setNow] = useState(Date.now());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

    //aktiver Countdown
    useEffect(() => {
    if (!matchDate || executed) return;

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [matchDate, executed]);

  // Picker initialisieren, falls Datum existiert
  useEffect(() => {
    if (matchDate) {
      setSelectedDate(new Date(matchDate));
    }
  }, [matchDate]);

  // Countdown Text
  const countdownText = useMemo(() => {
    if (!matchDate || executed) return "";

    const diff = new Date(matchDate).getTime() - now;

    if (diff <= 0) return "🎄 Matching wird gerade ausgeführt";

    const sec = Math.floor(diff / 1000);
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${d} Tage ${h} Std ${m} Min ${s} Sek`;
  }, [matchDate, executed, now]);


  // ----------------------------------
  // Guards
  // ----------------------------------
  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nur Admins können das Matching verwalten.</Text>
      </View>
    );
  }

  if (!activeTeamId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Bitte zuerst ein aktives Team auswählen.</Text>
      </View>
    );
  }

  // ----------------------------------
  // SAVE (Countdown-Workflow)
  // ----------------------------------
  async function onSave() {
    const now = Date.now();
    const min = now + 2 * 60 * 1000;

    if (selectedDate.getTime() < min) {
      Alert.alert(
        "Datum zu früh ⛔",
        "Bitte wähle ein Datum mindestens 2 Minuten in der Zukunft.\n\nBeispiel:\nJetzt 10:30 → mindestens 10:32."
      );
      return;
    }

    setSaving(true);
    try {
      const pad = (n: number) => String(n).padStart(2, "0");
      const d = selectedDate;
      const local =
        `${d.getFullYear()}-` +
        `${pad(d.getMonth() + 1)}-` +
        `${pad(d.getDate())}T` +
        `${pad(d.getHours())}:` +
        `${pad(d.getMinutes())}:` +
        `${pad(d.getSeconds())}`;


      await adminSetMatchingDate(activeTeamId, local);
      await refresh();

      Alert.alert(
        "Matching geplant ✅",
        `Das Matching für "${activeTeamName}" wurde geplant.\n\n⏳ Der Countdown läuft jetzt.\n\nℹ️ Das Matching wird automatisch ausgeführt, sobald der Countdown endet.\n\n⚠️ Nutze „Manuell ausführen“ nur als Override.`
      );
    } catch {
      Alert.alert(
        "Speichern fehlgeschlagen",
        "Das Datum konnte nicht gespeichert werden.\n\nMögliche Gründe:\n• Datum liegt zu nah in der Zukunft\n• Netzwerkfehler\n• Team nicht korrekt gesetzt\n\nBitte erneut versuchen."
      );
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------
  // Actions
  // ----------------------------------
  async function onDelete() {
    setSaving(true);
    try {
      await adminDeleteMatching(activeTeamId);
      await refresh();
      Alert.alert("Gelöscht", "Matching wurde entfernt.");
    } finally {
      setSaving(false);
    }
  }

  async function onManualRun() {
    setSaving(true);
    try {
      await adminRunManual(activeTeamId);
      await refresh();
      Alert.alert(
        "Manuell ausgeführt ⚠️",
        "Das Matching wurde sofort ausgeführt und der Countdown ignoriert."
      );
    } finally {
      setSaving(false);
    }
  }

  async function onRerun() {
    setSaving(true);
    try {
      await adminRerun(activeTeamId);
      await refresh();
      Alert.alert("Re-Run erfolgreich", "Matching wurde neu berechnet.");
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 10 }}>
        Silent Santa Matching 🎅
      </Text>

      <Text style={{ marginBottom: 16 }}>
        Team: <Text style={{ fontWeight: "700" }}>{activeTeamName}</Text>
      </Text>

      {saving && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginLeft: 8 }}>Speichern…</Text>
        </View>
      )}

      {/* Status */}
      <View
        style={{
          padding: 12,
          borderRadius: 10,
          backgroundColor: "#f4f4f4",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: "700", marginBottom: 6 }}>📊 Status</Text>
        <Text>📅 Geplant: {matchDate ? "Ja" : "Nein"}</Text>
        <Text>✅ Ausgeführt: {executed ? "Ja" : "Nein"}</Text>
        <Text>
          ⚠️ Status:{" "}
          {dirty
            ? "Änderungen erkannt – wartet auf Ausführung"
            : "Aktuell"}
        </Text>
        {lastRunAt && (
          <Text>
            🕒 Letzter Lauf:{" "}
            {new Date(lastRunAt).toLocaleString("de-DE")}
          </Text>
        )}
        {!!countdownText && (
          <Text style={{ marginTop: 8, fontWeight: "700" }}>
            ⏳ {countdownText}
          </Text>
        )}
      </View>

      <Button title="Datum wählen" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(e, d) => {
            if (d) setSelectedDate(d);
            if (Platform.OS !== "ios") setShowPicker(false);
          }}
        />
      )}

      {Platform.OS === "ios" && showPicker && (
        <Button title="Fertig" onPress={() => setShowPicker(false)} />
      )}

      <View style={{ height: 12 }} />
      <Button title="Matching speichern (Countdown)" onPress={onSave} />

      <View style={{ height: 10 }} />
      <Button title="Matching löschen" color="red" onPress={onDelete} />

      <View style={{ height: 20 }} />
      <Button
        title="Manuell ausführen (SOFORT – ignoriert Countdown)"
        onPress={onManualRun}
      />

      <View style={{ height: 10 }} />
      <Button title="Re-Run (nur bei dirty + executed)" onPress={onRerun} />
    </View>
  );
}
