// src/context/MatchingStatusContext.tsx
import React, { createContext, useEffect, useRef, useState } from "react";
import { apiGet } from "../api/api";
import { apiGetMatchingStatus } from "../api/matching";
import * as SecureStore from "expo-secure-store";

export const MatchingStatusContext = createContext<any>(null);

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function computeCountdown(targetIso: string | null) {
  if (!targetIso) return null;

  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diffSeconds = Math.max(Math.floor((target - now) / 1000), 0);

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return {
    days: pad2(days),
    hours: pad2(hours),
    minutes: pad2(minutes),
    seconds: pad2(seconds),
    isZero: diffSeconds === 0,
  };
}

export function MatchingStatusProvider({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const [userDisplayName, setUserDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [activeTeamName, setActiveTeamName] = useState("");

  // Matching Status (pro Team)
  const [matchDate, setMatchDate] = useState<string | null>(null);
  const [executed, setExecuted] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [hasPartner, setHasPartner] = useState(false);

  // Countdown Cache
  const [countdown, setCountdown] = useState<any>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const calendarDate = matchDate ? matchDate.slice(0, 10) : null; // yyyy-mm-dd für Calendar

  const hasActiveMatching = !!matchDate && executed === false;

  async function loadStatus(isPoll = false) {
    try {
      isPoll ? setIsPolling(true) : setLoading(true);

      const me = await apiGet("/api/auth/me");
      if (!me) return;

      setUserDisplayName(me.displayName);
      setAvatarUrl(me.avatarUrl);
      setIsAdmin(me.admin === true);

      const teamId = me.activeTeamId ?? null;
      setActiveTeamId(teamId);

      if (!teamId) {
        setActiveTeamName("");
        setMatchDate(null);
        setExecuted(false);
        setDirty(false);
        setLastRunAt(null);
        setHasPartner(false);
        setCountdown(null);
        return;
      }

      const team = await apiGet(`/api/team/me?teamId=${teamId}`);
      setActiveTeamName(team?.name ?? "");

      const status = await apiGetMatchingStatus(teamId);

      setMatchDate(status.matchDate ?? null);
      setExecuted(status.executed === true);
      setDirty(status.dirty === true);
      setLastRunAt(status.lastRunAt ?? null);
      setHasPartner(status.hasPartner === true);

    } catch (e) {
      console.log("MatchingStatusContext error", e);
    } finally {
      setLoading(false);
      setIsPolling(false);
    }
  }

  // Polling
  useEffect(() => {
    loadStatus(false);

    pollingRef.current = setInterval(() => {
      loadStatus(true);
    }, 10000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Countdown tick (nur wenn active matching)
  useEffect(() => {
    if (!hasActiveMatching) {
      setCountdown(null);
      return;
    }

    const id = setInterval(() => {
      setCountdown(computeCountdown(matchDate));
    }, 1000);

    // initial sofort
    setCountdown(computeCountdown(matchDate));

    return () => clearInterval(id);
  }, [hasActiveMatching, matchDate]);

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

        matchDate,
        calendarDate,
        executed,
        dirty,
        lastRunAt,
        hasPartner,

        hasActiveMatching,
        countdown,

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
