import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "MyPartner">;

export default function MyPartnerScreen({ route, navigation }: Props) {
  const { partnerId } = route.params;

  const fakeUsers: any = {
    "1": "André",
    "2": "Maria",
    "3": "John",
    "4": "Sarah",
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28 }}>Your Gift Partner 🎁</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 22 }}>
          {fakeUsers[partnerId]}
        </Text>
        <Text style={{ marginTop: 10, color: "#666" }}>
          User ID: {partnerId}
        </Text>
      </View>

      <Button
        title="View Partner Wishlist"
        onPress={() =>
          navigation.navigate("PartnerWishlist", { partnerId })
        }
      />
    </View>
  );
}
