import React from "react";
import { Image, View } from "react-native";
import { resolveTeamAvatar } from "../utils/avatar";

export default function TeamAvatar({ url, size = 60 }: any) {
  return (
    <View>
      <Image
        source={{ uri: resolveTeamAvatar(url) }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: "#c0392b",
        }}
      />
    </View>
  );
}
