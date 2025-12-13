// src/screens/UserHomeScreen.tsx
import React, { useContext } from "react";
import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import AvatarPicker from "../component/AvatarPicker";
import { MatchingStatusContext } from "../context/MatchingStatusContext";
import * as ImagePicker from "expo-image-picker";
import { apiUploadAvatar } from "../api/user";

export default function UserHomeScreen({ navigation }: any) {
  const {
    userDisplayName,
    activeTeamName,
    avatarUrl,
    isAdmin,
    scheduledDate,
    countdownText,
    hasPartner,
    logout,
    refresh,
  } = useContext(MatchingStatusContext);

  const handleChangeAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (res.canceled) return;

    try {
      await apiUploadAvatar(res.assets[0].uri);
      Alert.alert("Avatar", "Avatar aktualisiert!");
      refresh();
    } catch {
      Alert.alert("Fehler", "Avatar konnte nicht hochgeladen werden.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 30 }}>
      {/* Admin */}
      {isAdmin && (
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() => navigation.navigate("AdminDashboard")}
        >
          <Text style={{ fontSize: 28 }}>⚙️</Text>
        </TouchableOpacity>
      )}

      {/* Avatar */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <AvatarPicker
          avatarUrl={avatarUrl}
          size={130}
          onPress={handleChangeAvatar}
        />
        <Text style={{ marginTop: 8, color: "#555" }}>Avatar ändern</Text>
      </View>

      <Text style={{ fontSize: 28, fontWeight: "600", textAlign: "center" }}>
        Hello {userDisplayName}
      </Text>

      {activeTeamName && (
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Team: {activeTeamName}
        </Text>
      )}

      {/* ⏳ COUNTDOWN NUR WENN GEPLANT */}
      {scheduledDate && (
        <View style={{ alignItems: "center", marginBottom: 25 }}>
          <Text style={{ fontSize: 18, color: "#8B0000" }}>
            {countdownText}
          </Text>
        </View>
      )}

      {/* 🎄 PARTNER BUTTON NUR WENN MATCHING FERTIG */}
      {hasPartner && (
        <View style={{ marginBottom: 25 }}>
          <Button
            title="🎄 Meinen Partner anzeigen"
            onPress={() => navigation.navigate("MyPartner")}
          />
        </View>
      )}

      {/* Navigation */}
      <Button
        title="🎁 Meine Wishlist"
        onPress={() => navigation.navigate("Wishlist")}
      />
      <View style={{ height: 12 }} />
      <Button
        title="👥 Meine Teams"
        onPress={() => navigation.navigate("TeamList")}
      />
      <View style={{ height: 12 }} />
      <Button
        title="🔔 Regeln"
        onPress={() => navigation.navigate("Rules")}
      />

      <View style={{ marginTop: 40 }}>
        <Button
          title="Logout"
          color="red"
          onPress={async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            });
          }}
        />
      </View>
    </View>
  );
}
