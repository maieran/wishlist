import { useFonts } from "expo-font";

export function useAppFonts() {
  return useFonts({
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "BellamySignature": require("../../assets/fonts/BellamySignature.ttf"),
  });
}
