import { API_BASE } from "../api/api";

export function resolveTeamAvatar(url: string | null) {
  if (!url || url === "") {
    return `${API_BASE}/avatars/default-team.png`;
  }

  if (!url.startsWith("http")) {
    return `${API_BASE}${url}`;
  }

  return url;
}
