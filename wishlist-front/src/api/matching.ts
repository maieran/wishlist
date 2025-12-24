// src/api/matching.ts
import { apiGet, apiPost, apiDelete } from "./api";

// ----------------------------
// USER
// ----------------------------

// Status für ein Team (Countdown, executed, dirty, etc.)
export function apiGetMatchingStatus(teamId: number) {
  return apiGet(`/api/matching/status?teamId=${teamId}`);
}

// 🎁 Eigener Partner (nach Matching)
export function apiMyPartner(teamId: number) {
  return apiGet(`/api/matching/me?teamId=${teamId}`);
}

// ----------------------------
// ADMIN
// ----------------------------

// Matching-Datum setzen / ändern
export function adminSetMatchingDate(
  teamId: number,
  matchDateIsoLocal: string
) {
  return apiPost(`/api/matching/config?teamId=${teamId}`, {
    matchDate: matchDateIsoLocal,
  });
}

// Matching löschen
export function adminDeleteMatching(teamId: number) {
  return apiDelete(`/api/matching/config?teamId=${teamId}`);
}

// Manuell ausführen (Override)
export function adminRunManual(teamId: number) {
  return apiPost(`/api/matching/run-manual?teamId=${teamId}`, {});
}

// Re-Run (nur wenn dirty + executed)
export function adminRerun(teamId: number) {
  return apiPost(`/api/matching/rerun?teamId=${teamId}`, {});
}
