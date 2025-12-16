// src/context/MatchingStatusContext.tsx
import React, { createContext, useEffect, useState, useRef } from "react";
import { apiGet } from "../api/api";
import * as SecureStore from "expo-secure-store";

export const MatchingStatusContext = createContext<any>(null);

export function MatchingStatusProvider({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const [userDisplayName, setUserDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [activeTeamName, setActiveTeamName] = useState("");

  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  const [executed, setExecuted] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);

  const [countdownText, setCountdownText] = useState("");

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ------------------------------------------------
  // 📅 EFFECTIVE DATE (NUR für Team-Mitglieder!)
  // ------------------------------------------------
  const effectiveDate =
    activeTeamId && scheduledDate
      ? scheduledDate
      : activeTeamId && hasPartner
      ? lastRunAt
      : null;

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
    ? new Date(effectiveDate).toLocaleDateString("de-DE", {
        weekday: "long",
      })
    : "";

  // ------------------------------------------------
  // 🔄 LOAD STATUS (Single Source of Truth)
  // ------------------------------------------------
  async function loadStatus(isPoll = false) {
    try {
      if (isPoll) setIsPolling(true);
      else setLoading(true);

      const me = await apiGet("/api/auth/me");
      if (!me) return;

      setUserDisplayName(me.displayName);
      setAvatarUrl(me.avatarUrl);
      setIsAdmin(me.admin === true);

      const teamId = me.activeTeamId ?? null;
      setActiveTeamId(teamId);

      // ❌ KEIN TEAM → KEIN MATCHING, KEIN COUNTDOWN
      if (!teamId) {
        setActiveTeamName("");
        setScheduledDate(null);
        setLastRunAt(null);
        setExecuted(false);
        setDirty(false);
        setHasPartner(false);
        setCountdownText("");
        return;
      }

      // ✅ TEAMDATEN
      const team = await apiGet(`/api/team/me?teamId=${teamId}`);
      setActiveTeamName(team?.name ?? "");

      // ✅ MATCHING-STATUS
      const status = await apiGet("/api/matching/status");

      setScheduledDate(status.matchDate ?? null);
      setExecuted(status.executed === true);
      setDirty(status.dirty === true);

      // lastRunAt nur anzeigen, wenn Matching tatsächlich genutzt wurde
      setLastRunAt(status.hasPartner ? status.lastRunAt ?? null : null);

      // ✅ PARTNER nur für Team-Mitglieder
      const partnerRes = await apiGet(`/api/matching/me?teamId=${teamId}`);
      setHasPartner(partnerRes?.found === true);
    } catch (e) {
      console.log("MatchingStatusContext error", e);
    } finally {
      setLoading(false);
      setIsPolling(false);
    }
  }

  // ------------------------------------------------
  // ⏳ COUNTDOWN – NUR WENN TEAM + MATCHING
  // ------------------------------------------------
  useEffect(() => {
    if (!activeTeamId || !scheduledDate) {
      setCountdownText("");
      return;
    }

    const id = setInterval(() => {
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
  }, [scheduledDate, activeTeamId]);

  // ------------------------------------------------
  // 🔁 INITIAL LOAD + POLLING
  // ------------------------------------------------
  useEffect(() => {
    loadStatus(false);

    pollingRef.current = setInterval(() => {
      loadStatus(true);
    }, 10000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <MatchingStatusContext.Provider
      value={{
        loading,
        isPolling,

        userDisplayName,
        avatarUrl,
        isAdmin,

        activeTeamId,
        activeTeamName,

        scheduledDate,
        lastRunAt,
        executed,
        dirty,

        effectiveDateISO,
        effectiveDatePretty,
        effectiveWeekday,

        hasPartner,
        countdownText,

        refresh: () => loadStatus(false),

        logout: async () => {
          await SecureStore.deleteItemAsync("token");
        },
      }}
    >
      {children}
    </MatchingStatusContext.Provider>
  );
}
