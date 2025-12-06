import * as SecureStore from "expo-secure-store";

export const API_BASE = "http://192.168.0.125:8080"; // your mac's IP


export async function apiGet(path: string) {
  const token = await SecureStore.getItemAsync("token");

  const res = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return null; // leere Antworten sind ok
  }
}


// ⭐⭐⭐ WICHTIGER FIX HIER ⭐⭐⭐
export async function apiPost(
  path: string,
  body: any,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  const token = await SecureStore.getItemAsync("token");

  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: method === "DELETE" ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: any;

  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  // ❗ FIX: Wenn Backend Fehler sendet -> THROW ❗
  if (!res.ok) {
    const message = parsed?.message || "Unbekannter Fehler beim Server.";
    throw new Error(message);
  }

  return parsed;
}
