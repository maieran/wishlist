// src/api/settings.ts
import { apiGet, apiPost } from "./api";

export type MatchingDateResponse = {
  dateTime: string | null; // ISO String oder null
};

// Alle User dürfen lesen
export async function fetchMatchingDate(): Promise<MatchingDateResponse> {
  return apiGet("/api/settings/matching-date");
}

// Nur Admins
export async function adminSetMatchingDate(isoDateTime: string) {
  return apiPost("/api/admin/settings/matching-date", {
    dateTime: isoDateTime,
  });
}

export async function adminClearMatchingDate() {
  return apiPost("/api/admin/settings/matching-date", {}, "DELETE");
}
