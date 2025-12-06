import * as SecureStore from "expo-secure-store";
import { API_BASE } from "../api/api";



export type Priority = 'red' | 'blue' | 'green' | 'none';

export type WishlistItem = {
  id: number;
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

  const raw = await res.json();

  // BACKEND → FRONTEND MAPPING
  return raw.map((item: any) => ({
    id: item.id,
    title: item.name,                     // FIX
    description: item.description ?? "",
    price: item.price ?? 0,
    priority: item.priority ?? "none",    // FIX
    imageUri: item.imageUrl ?? undefined, // FIX
  }));
}

// ---- ADD ----
export async function addWishlistItem(item: Omit<WishlistItem, "id">) {
  const headers = await authHeaders();

  const body = {
    name: item.title,                 // FIX
    description: item.description,
    price: item.price,
    priority: item.priority,
    imageUrl: item.imageUri ?? null,  // placeholder for future cloud upload
  };

  const res = await fetch(`${BASE}/api/wishlist`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const saved = await res.json();

  // return mapped version
  return {
    id: saved.id,
    title: saved.name,                  
    description: saved.description ?? "",
    price: saved.price ?? 0,
    priority: saved.priority ?? "none",
    imageUri: saved.imageUrl ?? undefined,
  };
}

// ---- UPDATE ----
export async function updateWishlistItem(id: string, updated: WishlistItem) {
  const headers = await authHeaders();

  const body = {
    name: updated.title,
    description: updated.description,
    price: updated.price,
    priority: updated.priority,
    imageUrl: updated.imageUri ?? null,
  };

  await fetch(`${BASE}/api/wishlist/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
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
