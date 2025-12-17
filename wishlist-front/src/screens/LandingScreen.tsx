// src/screens/LandingScreen.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

export default function LandingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* LOGO */}
      <View style={styles.logoWrapper}>
        <Text style={styles.logoText}> silent </Text>
        <Image
          source={require("../../assets/images/santa-hat.png")}
          style={styles.santaHat}
          resizeMode="contain"
        />
        <Text style={styles.logoText}> santa</Text>
      </View>

      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/santa-team.png")}
          style={styles.teamImage}
          resizeMode="cover"
        />
        <Image
          source={require("../../assets/images/red-seal.png")}
          style={styles.redSeal}
          resizeMode="contain"
        />
      </View>

      {/* HEADLINE */}
      <View style={styles.headlineWrapper}>
        <Text style={styles.helloText}>Hello</Text>
        <Text style={styles.friendText}> friend,</Text>
      </View>

      {/* DESCRIPTION */}
      <Text style={styles.description}>
        It’s time to choose gifts and bring joy to those who matter most —
        <Text style={styles.descriptionBold}> your closest friends.</Text>
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>join the exchange</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F5",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  /* LOGO */
  logoWrapper: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  logoText: {
    fontFamily: "BellamySignature",
    fontSize: 72,
    lineHeight: 88,          
    letterSpacing: 3,
    color: "#960E12",
    textTransform: "lowercase",
    includeFontPadding: false, // Android-Fix
  },

  santaHat: {
    width: 25,
    height: 22,
    marginHorizontal: 5,
    transform: [
      { scaleX: -1 },
      { translateY: 10 },
    ],
  },


  /* IMAGE */
  imageWrapper: {
    marginTop: 32,
    width: "100%",
    maxWidth: 360,
    aspectRatio: 360 / 264,
    alignItems: "center",
    justifyContent: "center",
  },
  teamImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  redSeal: {
    position: "absolute",
    width: 58,
    height: 61,
    bottom: 6,
    right: 12,
  },

  /* HEADLINE */
  headlineWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -1,
    paddingVertical: 6,
  },
  helloText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 36,
    color: "#2B2B2B",
  },
friendText: {
  fontFamily: "BellamySignature",
  fontSize: 78,
  lineHeight: 50,          
  color: "#960E12",
  marginLeft: 20,
  includeFontPadding: false,
  transform: [{ translateY: 4 }],
},
  /* DESCRIPTION */
  description: {
    marginTop: 18,
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    lineHeight: 18,
    color: "#444",
    maxWidth: 320,
  },
  descriptionBold: {
    fontFamily: "PlusJakartaSans-Medium",
    color: "#2B2B2B",
  },

  /* BUTTON */
  button: {
    marginTop: 36,
    backgroundColor: "#931515",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 36,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24, // ✅ wie Figma
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
  },
});
