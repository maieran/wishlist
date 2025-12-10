import { apiGet, apiPost } from "./api";

// Eigene Wishlist laden
export async function apiWishlistMy() {
  return apiGet("/api/wishlist/me");
}

// Wishlist eines Partners laden
export async function apiWishlistByUser(userId: number) {
  return apiGet(`/api/wishlist/user/${userId}`);
}

// Neues Item anlegen
export async function apiWishlistCreate(item: any) {
  return apiPost("/api/wishlist", item, "POST");
}

// Item aktualisieren
export async function apiWishlistUpdate(id: number, item: any) {
  return apiPost(`/api/wishlist/${id}`, item, "PUT");
}

// Item löschen
export async function apiWishlistDelete(id: number) {
  return apiPost(`/api/wishlist/${id}`, null, "DELETE");
}
