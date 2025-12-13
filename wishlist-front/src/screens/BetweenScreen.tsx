// src/screens/BetweenScreen.tsx
import React, { useContext } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { MatchingStatusContext } from "../context/MatchingStatusContext";

export default function BetweenScreen({ navigation }: any) {
  const {
    loading,
    scheduledDate,
    scheduledDateISO,
    scheduledDatePretty,
    scheduledWeekday,
    countdownText,
    hasPartner,
    activeTeamName,
  } = useContext(MatchingStatusContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={{ marginTop: 12 }}>Daten werden geladen …</Text>
      </View>
    );
  }

  // 🧠 Kalender anzeigen wenn:
  // - Countdown läuft
  // - ODER Matching bereits ausgeführt wurde
  const showCalendar = scheduledDate !== null || hasPartner;

  const markedDates: any = scheduledDateISO
    ? {
        [scheduledDateISO]: {
          customStyles: {
            container: {
              backgroundColor: "#8B0000",
              borderRadius: 999,
            },
            text: {
              color: "white",
              fontWeight: "700",
            },
          },
        },
      }
    : {};

  return (
    <View style={{ flex: 1, padding: 30, alignItems: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 10 }}>
        {activeTeamName || "Silent Santa"}
      </Text>

      {/* =====================================
          MATCHING AKTIV ODER ABGESCHLOSSEN
      ====================================== */}
      {showCalendar ? (
        <>
          <Text style={{ fontSize: 20, marginBottom: 6 }}>
            📅 Silent-Santa Matching:
          </Text>

          {scheduledDate && (
            <>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                {scheduledWeekday}, {scheduledDatePretty}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: "#8B0000",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                Bis zum SilentSanta:
              </Text>

              <Text
                style={{
                  fontSize: 22,
                  color: "#8B0000",
                  fontWeight: "700",
                }}
              >
                {countdownText}
              </Text>
            </>
          )}

          {hasPartner && (
            <Text
              style={{
                fontSize: 20,
                marginTop: 15,
                color: "#2e7d32",
                fontWeight: "600",
              }}
            >
              🎁 Matching wurde ausgeführt!
            </Text>
          )}

          <Calendar
            current={scheduledDateISO || undefined}
            markedDates={markedDates}
            markingType="custom"
            style={{ width: "100%", marginVertical: 20 }}
          />

          {hasPartner && (
            <View style={{ marginTop: 15 }}>
              <Button
                title="🎄 Meinen Partner anzeigen"
                onPress={() => navigation.replace("MyPartner")}
              />
            </View>
          )}
        </>
      ) : (
        <Text style={{ marginTop: 30, fontSize: 18, color: "#777" }}>
          Kein Matching aktiv.
        </Text>
      )}

      <View style={{ marginTop: 40 }}>
        <Button title="Weiter" onPress={() => navigation.replace("Home")} />
      </View>
    </View>
  );
}
