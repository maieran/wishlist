// src/screens/UserHomeScreen.tsx
import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { MatchingStatusContext } from "../context/MatchingStatusContext";
import { apiUploadAvatar } from "../api/user";

export default function UserHomeScreen({ navigation }: any) {
  const {
    userDisplayName,
    avatarUrl,
    hasPartner,
    scheduledDate,
    effectiveDateISO,
    logout,
    refresh,
  } = useContext(MatchingStatusContext);

  /* ================= AVATAR ================= */

  const handleChangeAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (res.canceled) return;

    try {
      await apiUploadAvatar(res.assets[0].uri);
      refresh();
    } catch {
      Alert.alert("Error", "Avatar upload failed.");
    }
  };

  /* ================= COUNTDOWN ================= */

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
    if (!scheduledDate || !effectiveDateISO) return null;

    const target = new Date(effectiveDateISO).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(Math.floor((target - now) / 1000), 0);

    return formatCountdown(diffSeconds);
  }, [scheduledDate, effectiveDateISO]);

  /* ================= LOGOUT ================= */

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Do you really want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            });
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      {/* AVATAR */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../../assets/images/kitty-in-presents.jpg")
            }
            style={styles.avatarImage}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleChangeAvatar}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* HELLO */}
      <View style={styles.helloWrapper}>
        <Text style={styles.helloText}>Hello</Text>
        <Text style={styles.nameText}> {userDisplayName},</Text>
      </View>

      {/* SUBTEXT */}
      <Text style={styles.subText}>
        Build your wishlist, check the rules and get ready for the most exciting
        gift exchange of the year.
      </Text>

      {/* PARTNER */}
      {hasPartner && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("MyPartner")}
        >
          <Text style={styles.primaryButtonText}>
            🎁 Show my gift recipient
          </Text>
        </TouchableOpacity>
      )}

      {/* RULES (OUTLINE – gleiche Größe) */}
      <TouchableOpacity
        style={[styles.buttonBase, styles.outlineButton]}
        onPress={() => navigation.navigate("Rules")}
      >
        <Text style={styles.outlineButtonText}>Participation rules</Text>
      </TouchableOpacity>

      {/* WISHLIST (PRIMARY) */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Wishlist")}
      >
        <Text style={styles.primaryButtonText}>My wishlist</Text>
      </TouchableOpacity>

      {/* TEAMS (SECONDARY – gleiche Größe) */}
      <TouchableOpacity
        style={[styles.buttonBase, styles.secondaryButton]}
        onPress={() => navigation.navigate("TeamList")}
      >
        <Text style={styles.secondaryButtonText}>My teams</Text>
      </TouchableOpacity>

      {/* COUNTDOWN */}
      {countdown && (
        <View style={styles.countdownWrapper}>
          <Text style={styles.countdownLabel}>
            Remaining time until matching:
          </Text>

          <Text style={styles.countdownLine}>
            <Text style={styles.countdownNumber}>{countdown.days}</Text>
            <Text style={styles.countdownUnit}> days </Text>:
            <Text style={styles.countdownNumber}> {countdown.hours}</Text>
            <Text style={styles.countdownUnit}> hours </Text>:
            <Text style={styles.countdownNumber}> {countdown.minutes}</Text>
            <Text style={styles.countdownUnit}> minutes </Text>:
            <Text style={styles.countdownNumber}> {countdown.seconds}</Text>
            <Text style={styles.countdownUnit}> seconds</Text>
          </Text>
        </View>
      )}

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Logout</Text>
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

  avatarWrapper: {
    marginTop: 60,
    width: 182,
    height: 182,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarCircle: {
    width: 182,
    height: 182,
    borderRadius: 91,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  addButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 33,
    height: 33,
    borderRadius: 16.5,
    backgroundColor: "#931515",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 22,
  },

  helloWrapper: {
    flexDirection: "row",
    marginTop: 24,
  },

  helloText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 36,
  },

  nameText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 36,
    color: "#931515",
  },

  subText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    maxWidth: 300,
  },

  /* BUTTON BASE */
  buttonBase: {
    marginTop: 16,
    width: "100%",
    height: 50,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButton: {
    marginTop: 16,
    width: "100%",
    height: 50,
    borderRadius: 36,
    backgroundColor: "#931515",
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 24,
    color: "#FFF",
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: "#931515",
  },

  outlineButtonText: {
    fontSize: 24,
    color: "#931515",
  },

  secondaryButton: {
    backgroundColor: "#EFECEC",
  },

  secondaryButtonText: {
    fontSize: 24,
    color: "#2B2B2B",
  },

  countdownWrapper: {
    marginTop: 32,
    alignItems: "center",
  },

  countdownLabel: {
    fontSize: 14,
    marginBottom: 6,
  },

  countdownLine: {
    fontSize: 14,
    color: "#931515",
  },

  countdownNumber: {
    fontWeight: "600",
  },

  countdownUnit: {},

  logoutButton: {
    marginTop: 40,
  },

  logoutText: {
    fontSize: 18,
    color: "#B00000",
  },
});
