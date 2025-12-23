import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

export default function AvatarPicker({ avatarUrl, size = 130, onPress }: any) {
  const source = avatarUrl
    ? { uri: avatarUrl }
    : require("../../assets/images/kitty-in-present.png");

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3,
            borderColor: "#c0392b",
          }}
        />

        {/* + Badge */}
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: size * 0.28,
            height: size * 0.28,
            backgroundColor: "#e74c3c",
            borderRadius: 999,
            borderWidth: 2,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: size * 0.18 }}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
