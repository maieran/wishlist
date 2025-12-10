import { apiGet, apiPost } from "./api";

// Aktives Team laden
export async function apiTeamDetails(teamId: number) {
  return apiGet(`/api/team/me?teamId=${teamId}`);
}

// Alle Teams des Users
export async function apiTeamList() {
  return apiGet("/api/team/list");
}

// Team erstellen
export async function apiTeamCreate(name: string) {
  return apiPost("/api/team/create", { name });
}

// Team beitreten
export async function apiTeamJoin(inviteCode: string) {
  return apiPost("/api/team/join", { inviteCode });
}

// Team aktivieren
export async function apiTeamActivate(teamId: number) {
  return apiPost(`/api/team/activate/${teamId}`, {});
}

// Team verlassen
export async function apiTeamLeave(teamId: number) {
  return apiPost(`/api/team/${teamId}/leave`, {});
}

// Team löschen (Owner)
export async function apiTeamDelete(teamId: number) {
  return apiPost(`/api/team/${teamId}/delete`, {});
}

// Kick Member
export async function apiTeamKick(teamId: number, userId: number) {
  return apiPost(`/api/team/${teamId}/kick/${userId}`, {});
}
