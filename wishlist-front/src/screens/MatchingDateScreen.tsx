import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
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

type MeResponse = {
  userId: number;
  displayName: string;
  admin: boolean;
};

export default function MatchingDateScreen({ navigation }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [matchingIso, setMatchingIso] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [countdown, setCountdown] = useState("");

  const { scheduledDate, executed } = useContext(MatchingStatusContext);

  // -------- ADMIN FLAG LADEN --------
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

  // -------- MATCHING DATE LADEN (initial über /api/settings) --------
  useEffect(() => {
    async function loadDate() {
      try {
        const res = await fetchMatchingDate();
        if (res.dateTime) {
          setMatchingIso(res.dateTime);
          setSelectedDate(new Date(res.dateTime));
        } else {
          setMatchingIso(null);
          setSelectedDate(null);
        }
      } catch (e) {
        console.log("Error loading matching date", e);
      }
    }
    loadDate();
  }, []);

  // -------- OPTIONAL: Context-Daten spiegeln --------
  useEffect(() => {
    if (scheduledDate) {
      setMatchingIso(scheduledDate);
      if (!selectedDate) {
        setSelectedDate(new Date(scheduledDate));
      }
    }
  }, [scheduledDate]);

  // -------- COUNTDOWN --------
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
        setCountdown("🎅 Matching läuft oder wurde bereits ausgeführt!");
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

  // ---------- ADMIN: DATUM SPEICHERN ----------
  async function onSave() {
    try {
      if (!selectedDate) {
        Alert.alert("Fehler", "Bitte ein Datum auswählen.");
        return;
      }

      const iso = selectedDate.toISOString();
      await adminSetMatchingDate(iso);
      setMatchingIso(iso);

      Alert.alert("Gespeichert", "Matching-Datum wurde gesetzt.");
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Konnte Matching-Datum nicht speichern.");
    }
  }

  // ---------- ADMIN: DATUM LÖSCHEN ----------
  async function onClear() {
    try {
      await adminClearMatchingDate();
      setMatchingIso(null);
      setSelectedDate(null);
      Alert.alert("Ok", "Matching-Datum gelöscht.");
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Konnte Matching-Datum nicht löschen.");
    }
  }

  // ---------- UI ----------
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Silent Santa Datum 🎅
      </Text>

      {matchingIso ? (
        <Text style={{ marginBottom: 10 }}>
          Geplantes Matching:
          {"\n"}
          <Text style={{ fontWeight: "bold" }}>{matchingIso}</Text>
        </Text>
      ) : (
        <Text style={{ marginBottom: 10 }}>
          Noch kein Matching-Datum gesetzt.
        </Text>
      )}

      {/* Zusatzinfo aus Context */}
      {executed && (
        <Text style={{ color: "green", marginBottom: 10 }}>
          🎅 Matching wurde bereits mindestens einmal ausgeführt.
        </Text>
      )}

      {countdown !== "" && (
        <Text style={{ marginBottom: 20, fontSize: 18 }}>
          Countdown:
          {"\n"}
          <Text style={{ fontWeight: "bold" }}>{countdown}</Text>
        </Text>
      )}

      {/* ----------- ADMIN BEREICH ----------- */}
      {isAdmin && (
        <>
          <Text style={{ fontSize: 20, marginBottom: 10, marginTop: 20 }}>
            Admin – Datum auswählen
          </Text>

          {selectedDate && (
            <Text style={{ marginBottom: 10 }}>
              Ausgewählt:
              {"\n"}
              <Text style={{ fontWeight: "bold" }}>
                {selectedDate.toISOString()}
              </Text>
            </Text>
          )}

          <Button title="Datum wählen" onPress={() => setShowPicker(true)} />

          {showPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, date) => {
                if (event.type === "dismissed") {
                  setShowPicker(false);
                  return;
                }
                setShowPicker(false);
                if (date) setSelectedDate(date);
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
