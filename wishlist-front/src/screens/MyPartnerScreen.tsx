import React, { useEffect, useState } from "react";
import { View, Text, Button, Image } from "react-native";
import { apiMyPartner } from "../api/matching";
import { apiTeamList } from "../api/team";

export default function MyPartnerScreen({ navigation }: any) {
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const teamList = await apiTeamList();
      const teamId = teamList.activeTeamId;

      const res = await apiMyPartner(teamId);
      setPartner(res);
    }
    load();
  }, []);

  if (!partner?.found) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20 }}>
          Kein Partner verfügbar.
        </Text>
        <Button title="Zurück" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <View style={{ padding: 30, alignItems: "center" }}>
      <Image
        source={{ uri: partner.avatarUrl }}
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          borderWidth: 3,
          borderColor: "#c0392b",
          marginBottom: 20,
        }}
      />

      <Text style={{ fontSize: 26, fontWeight: "600" }}>
        Du bist Santa für:
      </Text>

      <Text style={{ fontSize: 30, color: "#c0392b", marginVertical: 10 }}>
        🎁 {partner.displayName}
      </Text>

      <Button
        title="Wishlist anzeigen"
        onPress={() => navigation.navigate("PartnerWishlist", {
          partnerId: partner.userId
        })}
      />
    </View>
  );
}
