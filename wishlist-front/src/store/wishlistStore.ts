import * as SecureStore from "expo-secure-store";
import { API_BASE } from "../api/api";



export type Priority = 'red' | 'blue' | 'green' | 'none';

export type WishlistItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUri?: string;
  priority: Priority;
};

const BASE = API_BASE;

// Hilfsfunktion für authorized requests
async function authHeaders() {
  const token = await SecureStore.getItemAsync("token");
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
}

// ---- LOAD ----
export async function loadWishlist(): Promise<WishlistItem[]> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE}/api/wishlist/me`, { headers });

  if (!res.ok) {
    console.log("Error loading wishlist", await res.text());
    return [];
  }

  return await res.json();
}

// ---- ADD ----
export async function addWishlistItem(item: Omit<WishlistItem, "id">) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE}/api/wishlist`, {
    method: "POST",
    headers,
    body: JSON.stringify(item),
  });

  return await res.json(); // backend gibt neues Item zurück
}

// ---- UPDATE ----
export async function updateWishlistItem(id: string, updated: WishlistItem) {
  const headers = await authHeaders();
  await fetch(`${BASE}/api/wishlist/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updated),
  });
}

// ---- DELETE ----
export async function deleteWishlistItem(id: string) {
  const headers = await authHeaders();
  await fetch(`${BASE}/api/wishlist/${id}`, {
    method: "DELETE",
    headers,
  });
}

// ---- REORDER ----
// optional (falls dein Backend Reihenfolge speichern soll)
export async function reorderWishlist(newOrder: WishlistItem[]) {
  const headers = await authHeaders();
  await fetch(`${BASE}/api/wishlist/reorder`, {
    method: "POST",
    headers,
    body: JSON.stringify(newOrder),
  });
}
