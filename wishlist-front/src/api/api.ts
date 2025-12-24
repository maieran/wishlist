// src/api/api.ts
import * as SecureStore from "expo-secure-store";


export const API_BASE = process.env.EXPO_PUBLIC_API_BASE as string;

if (!API_BASE) {
  throw new Error("EXPO_PUBLIC_API_BASE ist nicht gesetzt");
}

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(message: string, status: number, body: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// ------------------------------
// GET (defensiv gegen 401, null)
// ------------------------------
export async function apiGet(path: string) {
  try {
    const token = await SecureStore.getItemAsync("token");

    const res = await fetch(API_BASE + path, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (res.status === 401) {
      return null; // ⛔ ausgeloggt
    }

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

// ------------------------------
// POST / PUT / DELETE
// ------------------------------
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

  if (!res.ok) {
    const msg = parsed?.message || "Unbekannter Fehler beim Server.";
    throw new ApiError(msg, res.status, parsed);
  }

  return parsed;
}

// src/api/api.ts (ergänzen)
export async function apiDelete(path: string) {
  const token = await SecureStore.getItemAsync("token");
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  return res.json().catch(() => ({}));
}

