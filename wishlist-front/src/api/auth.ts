import * as SecureStore from "expo-secure-store";

export async function logoutUser() {
  await SecureStore.deleteItemAsync("token");
}
