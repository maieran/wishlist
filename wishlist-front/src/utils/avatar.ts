import { API_BASE } from "../api/api";

export function resolveUserAvatar(url?: string | null) {
  if (!url) return API_BASE + "/avatars/default-avatar.png";
  if (url.startsWith("http")) return url;
  return API_BASE + url;
}

export function resolveTeamAvatar(url?: string | null) {
  if (!url) return API_BASE + "/avatars/default-team.png";
  if (url.startsWith("http")) return url;
  return API_BASE + url;
}
