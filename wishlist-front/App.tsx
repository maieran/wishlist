// App.tsx
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { MatchingStatusProvider } from "./src/context/MatchingStatusContext";
import { useAppFonts } from "./src/theme/fonts";

export default function App() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F6F5",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#931515" />
      </View>
    );
  }

  return (
    <MatchingStatusProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </MatchingStatusProvider>
  );
}
