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
