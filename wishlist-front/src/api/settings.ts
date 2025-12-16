// src/api/settings.ts
import { apiGet, apiPost } from "./api";

export type MatchingConfigResponse = {
  matchDate: string | null;
  executed?: boolean;
};

// GET
export async function fetchMatchingConfig(): Promise<MatchingConfigResponse> {
  return apiGet("/api/matching/config");
}

// POST (Admin)
export async function adminSetMatchingDate(iso: string) {
  return apiPost("/api/matching/config", { matchDate: iso });
}

// DELETE (Admin)
export async function adminClearMatchingDate() {
  return apiPost("/api/matching/clear", {});
}
