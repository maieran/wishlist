// src/context/MatchingStatusContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { apiGet } from "../api/api";
import * as SecureStore from "expo-secure-store";

export const MatchingStatusContext = createContext<any>(null);

export function MatchingStatusProvider({ children }: any) {
  const [loading, setLoading] = useState(true);

  const [userDisplayName, setUserDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [activeTeamName, setActiveTeamName] = useState("");

  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [hasPartner, setHasPartner] = useState(false);

  const [countdownText, setCountdownText] = useState("");

  // ----------------------------------------
  // 📅 EFFECTIVE DATE (für Kalender!)
  // ----------------------------------------
  const effectiveDate = scheduledDate ?? lastRunAt;

  const effectiveDateISO = effectiveDate
    ? new Date(effectiveDate).toISOString().slice(0, 10)
    : null;

  const effectiveDatePretty = effectiveDate
    ? new Date(effectiveDate).toLocaleDateString("de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const effectiveWeekday = effectiveDate
    ? new Date(effectiveDate).toLocaleDateString("de-DE", { weekday: "long" })
    : "";

  // ----------------------------------------
  async function loadStatus() {
    try {
      setLoading(true);

      const me = await apiGet("/api/auth/me");
      if (!me) return;

      setUserDisplayName(me.displayName);
      setAvatarUrl(me.avatarUrl);
      setIsAdmin(me.admin === true);
      setActiveTeamId(me.activeTeamId ?? null);

      if (me.activeTeamId) {
        const team = await apiGet(`/api/team/me?teamId=${me.activeTeamId}`);
        setActiveTeamName(team?.name ?? "");
      } else {
        setActiveTeamName("");
      }

      // 🔑 Matching STATUS
      const status = await apiGet("/api/matching/status");

      setScheduledDate(status.matchDate ?? null);
      setLastRunAt(status.lastRunAt ?? null);

      // 🔑 Partner = einzig verlässlicher Done-Status
      if (me.activeTeamId) {
        const partner = await apiGet(
          `/api/matching/me?teamId=${me.activeTeamId}`
        );
        setHasPartner(partner?.found === true);
      } else {
        setHasPartner(false);
      }
    } catch (e) {
      console.log("MatchingStatusContext error", e);
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------
  // ⏳ COUNTDOWN (nur wenn scheduled)
  // ----------------------------------------
  useEffect(() => {
    const id = setInterval(() => {
      if (!scheduledDate) {
        setCountdownText("");
        return;
      }

      const diff = new Date(scheduledDate).getTime() - Date.now();
      if (diff <= 0) {
        setCountdownText("Matching wird ausgeführt …");
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setCountdownText(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(id);
  }, [scheduledDate]);

  useEffect(() => {
    loadStatus();
    const poll = setInterval(loadStatus, 10000);
    return () => clearInterval(poll);
  }, []);

  return (
    <MatchingStatusContext.Provider
      value={{
        loading,

        userDisplayName,
        avatarUrl,
        isAdmin,

        activeTeamId,
        activeTeamName,

        scheduledDate,
        lastRunAt,

        effectiveDateISO,
        effectiveDatePretty,
        effectiveWeekday,

        hasPartner,
        countdownText,

        refresh: loadStatus,

        logout: async () => {
          await SecureStore.deleteItemAsync("token");
        },
      }}
    >
      {children}
    </MatchingStatusContext.Provider>
  );
}
