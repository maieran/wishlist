// src/screens/BetweenScreen.tsx
import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
  } = useContext(MatchingStatusContext);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loading}>Loading…</Text>
      </SafeAreaView>
    );
  }

  function formatCountdown(totalSeconds: number) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, "0");

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  }

  const countdown = useMemo(() => {
    if (!effectiveDateISO) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const target = new Date(effectiveDateISO).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(
      Math.floor((target - now) / 1000),
      0
    );

    return formatCountdown(diffSeconds);
  }, [effectiveDateISO]);

  return (
    <SafeAreaView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* CALENDAR */}
      <View style={styles.calendarCard}>
        <Calendar
          current={effectiveDateISO || undefined}
          markingType="custom"
          markedDates={
            effectiveDateISO
              ? {
                  [effectiveDateISO]: {
                    customStyles: {
                      container: styles.selectedDay,
                      text: styles.selectedDayText,
                    },
                  },
                }
              : {}
          }
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

      {/* COUNTDOWN */}
      <View style={styles.countdownWrapper}>
        <Text style={styles.countdownLabel}>
          Remaining time until matching:
        </Text>

        <Text style={styles.countdownLine}>
          <Text style={styles.countdownNumber}>{countdown.days}</Text>
          <Text style={styles.countdownUnit}> days </Text>
          <Text style={styles.separator}>:</Text>

          <Text style={styles.countdownNumber}>{countdown.hours}</Text>
          <Text style={styles.countdownUnit}> hours </Text>
          <Text style={styles.separator}>:</Text>

          <Text style={styles.countdownNumber}>{countdown.minutes}</Text>
          <Text style={styles.countdownUnit}> minutes </Text>
          <Text style={styles.separator}>:</Text>

          <Text style={styles.countdownNumber}>{countdown.seconds}</Text>
          <Text style={styles.countdownUnit}> seconds</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

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

  countdownWrapper: {
    marginTop: 32,
    alignItems: "center",
  },

  countdownLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#2B2B2B",
    marginBottom: 6,
  },

  countdownLine: {
    textAlign: "center",
  },

  countdownNumber: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#931515",
  },

  countdownUnit: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#931515",
  },

  separator: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#931515",
    marginHorizontal: 2,
  },
});
