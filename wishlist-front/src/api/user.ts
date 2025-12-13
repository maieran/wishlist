import { API_BASE } from "./api";
import * as SecureStore from "expo-secure-store";

export async function apiUploadAvatar(uri: string) {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const token = await SecureStore.getItemAsync("token");

  const res = await fetch(API_BASE + "/api/user/avatar", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });

  return await res.json();
}

