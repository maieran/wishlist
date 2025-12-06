import { apiGet, apiPost } from "./api";

export async function apiTeamMe() {
  return apiGet("/api/team/me");
}

export async function apiTeamCreate(name: string) {
  return apiPost("/api/team/create", { name });
}

export async function apiTeamJoin(inviteCode: string) {
  return apiPost("/api/team/join", { inviteCode });
}

export async function apiTeamLeave() {
  return apiPost("/api/team/leave", {});
}

export async function apiDeleteTeam(teamId: number) {
  return apiPost(`/api/team/delete/${teamId}`, {});
}

/* ---- NEW ---- */

export async function apiAdminGetAllTeams() {
  return apiGet("/api/team/admin/all");
}

export async function apiAdminAssignUser(teamId: number, userId: number) {
  return apiPost(`/api/team/admin/assign/${teamId}/${userId}`, {});
}

export async function apiGetTeamDetails() {
  return apiGet("/api/team/me/details");
}

