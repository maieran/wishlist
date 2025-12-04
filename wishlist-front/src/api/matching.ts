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
