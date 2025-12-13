import React from "react";
import { View, Text, ScrollView, TextStyle } from "react-native";

export default function RulesScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        🎅 Silent Santa – Regeln
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 12 }}>
        Willkommen beim Silent Santa Event! Hier findest du alle Regeln, damit
        das Erlebnis fair, spannend und anonym bleibt.
      </Text>

      <Text style={sectionTitle}>1️⃣ Teilnahme</Text>
      <Text style={sectionText}>
        • Jedes Teammitglied nimmt automatisch teil, sobald ein Matching
        durchgeführt wird.{"\n"}
        • Du bekommst genau eine Person zugelost.
      </Text>

      <Text style={sectionTitle}>2️⃣ Wunschliste</Text>
      <Text style={sectionText}>
        • Erstelle 3–10 Wunsch-Items.{"\n"}
        • Gib Prioritäten an (Rot = wichtig, Blau/Grün = Ideen).{"\n"}
        • Bilder sind erlaubt!{"\n"}
        • Sei kreativ, aber realistisch.
      </Text>

      <Text style={sectionTitle}>3️⃣ Matching</Text>
      <Text style={sectionText}>
        • Das Matching ist anonym und wird automatisch oder manuell vom Admin
        gestartet.{"\n"}
        • Du siehst nur die Wishlist deines Partners – niemand sonst.
      </Text>

      <Text style={sectionTitle}>4️⃣ Budget</Text>
      <Text style={sectionText}>
        • Einigt euch im Team auf ein Preislimit.{"\n"}
        • Halte dich fair daran.
      </Text>

      <Text style={sectionTitle}>5️⃣ Geschenkübergabe</Text>
      <Text style={sectionText}>
        • Bleibe anonym, falls euer Team das so möchte.{"\n"}
        • Achte auf hässliche Verpackung, wenn ihr einen Ugly-Gift-Contest macht 😄
      </Text>

      <Text style={sectionTitle}>6️⃣ Respekt</Text>
      <Text style={sectionText}>
        • Kein Spott über die Wishlist anderer.{"\n"}
        • Sei nett, humorvoll, aber nicht verletzend.
      </Text>

      <Text style={{ marginTop: 30, fontStyle: "italic", color: "#666" }}>
        Viel Spaß & frohes Wichteln! 🎁✨
      </Text>
    </ScrollView>
  );
}

const sectionTitle: TextStyle = {
  fontSize: 20,
  fontWeight: "600",
  marginTop: 20,
  marginBottom: 6,
};

const sectionText: TextStyle = {
  fontSize: 16,
  color: "#444",
  lineHeight: 22,
};
