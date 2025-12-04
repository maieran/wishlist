import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiTeamMe } from "../api/team";
import { apiMyPartner } from "../api/matching";

type Props = NativeStackScreenProps<RootStackParamList, "MyPartner">;

type PartnerResponse = {
  found: boolean;
  userId?: number;
  displayName?: string;
  message?: string;
};

export default function MyPartnerScreen({ navigation }: Props) {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [partner, setPartner] = useState<PartnerResponse | null>(null);

  useEffect(() => {
    async function loadTeam() {
      const meTeam = await apiTeamMe();
      if ("hasTeam" in meTeam && !meTeam.hasTeam) {
        setTeamId(null);
        setPartner({ found: false, message: "Du bist in keinem Team." });
        return;
      }
      const t = "hasTeam" in meTeam ? meTeam : { hasTeam: true, ...meTeam };
      setTeamId(t.teamId);
    }
    loadTeam();
  }, []);

  useEffect(() => {
    if (!teamId) return;

    async function loadPartner() {
      const data = await apiMyPartner(teamId);
      setPartner(data);
    }
    loadPartner();
  }, [teamId]);

  if (!partner) {
    return <Text style={{ padding: 20 }}>Lädt...</Text>;
  }

  if (!partner.found) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Kein Partner vom Matching gefunden.</Text>
        {partner.message && <Text>{partner.message}</Text>}
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Du bist SilentSanta von 🎁</Text>
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
