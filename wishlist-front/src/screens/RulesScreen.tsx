// src/screens/RulesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RulesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* TITLE */}
        <Text style={styles.title}>Participation Rules</Text>

        {/* SUBTITLE */}
        <Text style={styles.subtitle}>
          We collected all rules in one place to avoid chaos, scandals and
          philosophical debates in the chat.
        </Text>

        {/* FRAME */}
        <View style={styles.frameWrapper}>
          <Image
            source={require("../../assets/images/frame.png")}
            style={styles.frame}
            resizeMode="contain"
          />

          {/* WHITE RECTANGLE */}
          <View style={styles.whiteCard}>
            <Text style={styles.ruleText}>
              • Each participant adds their{" "}
              <Text style={styles.highlight}>wish-list</Text> in advance.
              {"\n\n"}
              • On the specified{" "}
              <Text style={styles.highlight}>date</Text>, pairs are assigned
              automatically.
              {"\n\n"}
              • Nobody sees who they are gifting to until the moment of{" "}
              <Text style={styles.highlight}>assignment</Text>.
              {"\n\n"}
              • The wish-list is a hint, but you may choose something{" "}
              <Text style={styles.highlight}>of your own</Text>.
              {"\n\n"}
              • The main rule — do not{" "}
              <Text style={styles.highlight}>reveal</Text> the pairs ahead of time.
            </Text>

            {/* SIGNATURE */}
            <Text style={styles.signature}> rules</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8F6F5",
  },

  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* TITLE */
  title: {
    marginTop: 24,
    fontFamily: "Inter-Regular",
    fontSize: 36,
    color: "#472424",
    textAlign: "center",
  },

  /* SUBTITLE */
  subtitle: {
    marginTop: 12,
    maxWidth: 313,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    lineHeight: 18,
    color: "#472424",
    textAlign: "center",
  },

  /* FRAME AREA */
  frameWrapper: {
    marginTop: 32,
    width: 381,
    height: 520,
    alignItems: "center",
    justifyContent: "center",
  },

  frame: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transform: [{ rotate: "180deg" }],
  },

  whiteCard: {
    width: 271,
    height: 408,
    backgroundColor: "#FFFFFF",
    padding: 18,
    justifyContent: "space-between",
  },

  /* RULE TEXT */
  ruleText: {
    marginTop: 25,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    lineHeight: 18,
    color: "#472424",
  },

  highlight: {
    fontFamily: "PlusJakartaSans-Medium",
    fontStyle: "italic",
    color: "#472424",
  },

  /* SIGNATURE */
  signature: {
    alignSelf: "flex-end",
    marginTop: 12,
    fontFamily: "BellamySignature",
    fontSize: 78,
    lineHeight: 78,
    color: "#960E12",
    marginBottom: 10,
  },
});
