import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { apiGet } from "../api/api";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
type Props = NativeStackScreenProps<RootStackParamList, "MyPartner">;

type PartnerResponse = {
  found: boolean;
  userId?: number;
  displayName?: string;
};

export default function MyPartnerScreen({ navigation }: Props) {
  const [partner, setPartner] = useState<PartnerResponse | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const meTeam = await apiGet("/api/team/me");
      setTeamId(meTeam.teamId);
    }
    load();
  }, []);

  useEffect(() => {
    if (!teamId) return;

    async function loadPartner() {
      const data = await apiGet(`/api/matching/me?teamId=${teamId}`);
      setPartner(data);
    }
    loadPartner();
  }, [teamId]);


  // 1️⃣ Noch keine Antwort erhalten → loading
  if (partner === null) {
    return <Text style={{ padding: 20 }}>Lädt...</Text>;
  }

  // 2️⃣ Antwort bekommen, aber found=false
  if (!partner.found) {
    return (
      <Text style={{ padding: 20 }}>
        Kein Partner vom Matching gefunden.
      </Text>
    );
  }

  // 3️⃣ Normaler Screen
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Dein Partner 🎁</Text>

      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {partner.displayName}
      </Text>

      <Button
        title="Partner Wishlist anzeigen"
        onPress={() =>
          navigation.navigate("PartnerWishlist", { partnerId: partner.userId! })
        }
      />
    </View>
  );
}
