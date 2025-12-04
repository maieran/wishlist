import { apiGet, apiPost } from "./api";

export async function adminFetchUsers() {
  return apiGet("/api/admin/users");
}

export async function adminCreateUser(user: {
  username: string;
  password: string;
  displayName: string;
  admin: boolean;
}) {
  return apiPost("/api/admin/users", user);
}

export async function adminUpdateUser(
  id: number,
  user: {
    username?: string;
    password?: string;
    displayName?: string;
    admin?: boolean;
  }
) {
  return apiPost(`/api/admin/users/${id}`, user, "PUT");
}

export async function adminDeleteUser(id: number) {
  return apiPost(`/api/admin/users/${id}`, {}, "DELETE");
}

export async function adminRunMatching() {
  return apiPost("/api/matching/run-manual", {});
}
