import { apiGet, apiPost } from "./api";

export async function apiMatchingConfig() {
  return apiGet("/api/matching/config");
}

export async function apiAdminRunMatching() {
  return apiPost("/api/matching/run-manual", {});
}

export async function apiMyPartner(teamId: number) {
  return apiGet(`/api/matching/me?teamId=${teamId}`);
}

// 🔥 Neu: Matching-Status für Context
export async function apiMatchingStatus() {
  return apiGet("/api/matching/status");
}

export async function adminRerunMatching() {
  return apiPost("/api/matching/rerun", {});
}
