// src/screens/BetweenScreen.tsx
import React, { useContext, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { MatchingStatusContext } from "../context/MatchingStatusContext";

export default function BetweenScreen({ navigation }: any) {
  const {
    loading,
    effectiveDateISO,
    activeTeamName,
    hasPartner,
    scheduledDate,
    executed,
    countdownText,
  } = useContext(MatchingStatusContext);

  /* ================= LOCAL SYNC SPINNER ================= */

  const [showSync, setShowSync] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSync(false);
    }, 11000); // 11 Sekunden

    return () => clearTimeout(timer);
  }, []);

  /* ================= MATCHING STATE ================= */

  const hasActiveMatching =
    !!scheduledDate && executed === false && !hasPartner;

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#931515" />
        <Text style={styles.loading}>Loading…</Text>
      </SafeAreaView>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* SYNCHRONIZING – IMMER 11 SEK */}
      {showSync && (
        <View style={styles.syncWrapper}>
          <ActivityIndicator size="small" color="#931515" />
          <Text style={styles.syncText}>Synchronizing…</Text>
        </View>
      )}

      {/* KEIN MATCHING */}
      {!hasActiveMatching && !showSync && (
        <Text style={styles.noMatchingText}>
          No active matching at the moment.
        </Text>
      )}

      {/* MATCHING AKTIV */}
      {hasActiveMatching && effectiveDateISO && !showSync && (
        <>
          {/* CALENDAR */}
          <View style={styles.calendarCard}>
            <Calendar
              current={effectiveDateISO}
              markingType="custom"
              markedDates={{
                [effectiveDateISO]: {
                  customStyles: {
                    container: styles.selectedDay,
                    text: styles.selectedDayText,
                  },
                },
              }}
              theme={{
                textDayFontFamily: "PlusJakartaSans-Regular",
                textMonthFontFamily: "PlusJakartaSans-Regular",
                textDayHeaderFontFamily: "PlusJakartaSans-Regular",
                monthTextColor: "#4A4A4A",
                arrowColor: "#4A4A4A",
              }}
            />
          </View>

          {/* TEAM NAME */}
          {activeTeamName && (
            <Text style={styles.teamName}>{activeTeamName}</Text>
          )}

          {/* COUNTDOWN */}
          <View style={styles.countdownWrapper}>
            <Text style={styles.countdownLabel}>
              Remaining time until matching:
            </Text>
            <Text style={styles.countdownLine}>{countdownText}</Text>
          </View>
        </>
      )}

      {/* BUTTONS */}
      {hasPartner && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("MyPartner")}
        >
          <Text style={styles.primaryButtonText}>
            Show Wish Recipient 🎁
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F5",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    marginTop: 12,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
  },

  back: {
    alignSelf: "flex-start",
    marginTop: 8,
  },

  backText: {
    fontSize: 32,
    color: "#4A4A4A",
  },

  syncWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  syncText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#931515",
  },

  calendarCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 8,
    width: "100%",
    maxWidth: 306,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 16 },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    elevation: 6,
  },

  selectedDay: {
    backgroundColor: "#931515",
    borderRadius: 999,
  },

  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  teamName: {
    marginTop: 16,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#2B2B2B",
    textAlign: "center",
  },

  countdownWrapper: {
    marginTop: 32,
    alignItems: "center",
  },

  countdownLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    marginBottom: 6,
  },

  countdownLine: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#931515",
    textAlign: "center",
  },

  primaryButton: {
    marginTop: 20,
    width: "100%",
    height: 50,
    borderRadius: 36,
    backgroundColor: "#931515",
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 24,
    color: "#FFFFFF",
  },

  noMatchingText: {
    marginTop: 40,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
