import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { apiMyPartner } from "../api/matching";
import { apiTeamList } from "../api/team";
import { MatchingStatusContext } from "../context/MatchingStatusContext";

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
  const [loading, setLoading] = useState(true);
  const { executed } = useContext(MatchingStatusContext);

  // ------------------------------
  // 1️⃣ Team laden
  // ------------------------------
  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await apiTeamList();
        const activeId: number | null = res.activeTeamId ?? null;

        if (!activeId) {
          setPartner({
            found: false,
            message: "Du hast noch kein aktives Team ausgewählt.",
          });
          setLoading(false);
          return;
        }

        setTeamId(activeId);
      } catch (e) {
        console.log("Error loading team", e);
        setPartner({
          found: false,
          message: "Konnte Teamdaten nicht laden.",
        });
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  // ------------------------------
  // 2️⃣ Partner laden (nur wenn executed)
  // ------------------------------
  useEffect(() => {
    if (!teamId) return;

    async function loadPartner() {
      setLoading(true);
      try {
        if (!executed) {
          setPartner({
            found: false,
            message: "Das Matching wurde noch nicht ausgeführt.",
          });
          return;
        }

        const data = await apiMyPartner(teamId!);
        setPartner(data);
      } catch (e) {
        console.log("Error loading partner", e);
        setPartner({
          found: false,
          message: "Matching-Daten konnten nicht geladen werden.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadPartner();
  }, [teamId, executed]);

  // ------------------------------
  // 3️⃣ Loading UI
  // ------------------------------
  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Lade Matching...</Text>
      </View>
    );
  }

  // ------------------------------
  // 4️⃣ Kein Partner gefunden / kein Matching
  // ------------------------------
  if (!partner || !partner.found) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Kein Partner verfügbar.
        </Text>

        {partner?.message && (
          <Text style={{ color: "gray" }}>{partner.message}</Text>
        )}

        <View style={{ marginTop: 20 }}>
          <Button
            title="Zur Teamübersicht"
            onPress={() => navigation.navigate("TeamList")}
          />
        </View>
      </View>
    );
  }

  // ------------------------------
  // 5️⃣ Partner vorhanden
  // ------------------------------
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>
        Du bist Silent Santa für:
      </Text>

      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#c0392b" }}>
        🎁 {partner.displayName}
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button
          title="Partner Wishlist anzeigen"
          onPress={() =>
            navigation.navigate("PartnerWishlist", {
              partnerId: partner.userId!,
            })
          }
        />
      </View>
    </View>
  );
}
