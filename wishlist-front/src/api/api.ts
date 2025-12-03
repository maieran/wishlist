import * as SecureStore from "expo-secure-store";

export const API_BASE = "http://192.168.0.125:8080"; // your mac's IP


export async function apiGet(path: string) {
  const token = await SecureStore.getItemAsync("token");

  return fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then(res => res.json());
}

export async function apiPost(path: string, body: any, method: "POST" | "PUT" | "DELETE" = "POST") {
  const token = await SecureStore.getItemAsync("token");

  return fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: method === "DELETE" ? undefined : JSON.stringify(body),
  })
    .then(async (res) => {
      if (res.status === 204) return {}; // no content
      return res.json();
    });
}

