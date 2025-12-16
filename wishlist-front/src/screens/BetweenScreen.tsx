// src/screens/BetweenScreen.tsx
import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MatchingStatusContext } from "../context/MatchingStatusContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BetweenScreen({ navigation }: any) {
  const {
    loading,
    isPolling,
    activeTeamId,
    scheduledDate,
    executed,
    dirty,
    effectiveDateISO,
    effectiveDatePretty,
    effectiveWeekday,
    countdownText,
    hasPartner,
    activeTeamName,
  } = useContext(MatchingStatusContext);

  const isTeamMember = !!activeTeamId;

  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isPolling) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [isPolling]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={{ marginTop: 12 }}>Aktuelle Daten werden geladen …</Text>
      </SafeAreaView>
    );
  }

  const showMatching = isTeamMember && (scheduledDate !== null || executed);

  return (
    <SafeAreaView style={{ flex: 1, padding: 30 }}>
      {isPolling && (
        <View style={{ position: "absolute", top: 18, right: 18 }}>
          <ActivityIndicator size="small" color="#8B0000" />
          <Animated.Text style={{ fontSize: 11, color: "#8B0000", opacity: pulse }}>
            aktualisiere …
          </Animated.Text>
        </View>
      )}

      <Text style={{ fontSize: 28, fontWeight: "700", textAlign: "center" }}>
        {activeTeamName || "Silent Santa"}
      </Text>

      {showMatching ? (
        <>
          <Text style={{ fontSize: 20, marginTop: 12 }}>📅 Silent-Santa Matching</Text>

          <Text style={{ fontSize: 20, fontWeight: "600" }}>
            {effectiveWeekday}, {effectiveDatePretty}
          </Text>

          {scheduledDate && (
            <>
              <Text style={{ marginTop: 10, color: "#8B0000" }}>
                Bis zum SilentSanta:
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#8B0000" }}>
                {countdownText}
              </Text>
            </>
          )}

          {dirty && (
            <Text style={{ marginTop: 8, color: "#b71c1c" }}>
              ⚠️ Team hat sich geändert – neues Matching nötig
            </Text>
          )}

          <Calendar
            current={effectiveDateISO || undefined}
            markedDates={
              effectiveDateISO
                ? {
                    [effectiveDateISO]: {
                      customStyles: {
                        container: { backgroundColor: "#8B0000", borderRadius: 999 },
                        text: { color: "white", fontWeight: "700" },
                      },
                    },
                  }
                : {}
            }
            markingType="custom"
            style={{ marginVertical: 20 }}
          />

          {hasPartner && (
            <Button
              title="🎄 Meinen Partner anzeigen"
              onPress={() => navigation.replace("MyPartner")}
            />
          )}
        </>
      ) : (
        <Text style={{ marginTop: 40, textAlign: "center", color: "#777" }}>
          Kein Matching aktiv.
        </Text>
      )}

      <View style={{ marginTop: 40 }}>
        <Button title="Weiter" onPress={() => navigation.replace("Home")} />
      </View>
    </SafeAreaView>
  );
}
