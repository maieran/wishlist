import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { apiMatchingStatus } from "../api/matching";

type MatchingStatus = {
  executed: boolean;
  scheduledDate: string | null;
  lastRunAt: string | null;
  hasPartner: boolean;
};

export const MatchingStatusContext = createContext<MatchingStatus>({
  executed: false,
  scheduledDate: null,
  lastRunAt: null,
  hasPartner: false,
});

type Props = {
  children: ReactNode;
};

export function MatchingStatusProvider({ children }: Props) {
  const [state, setState] = useState<MatchingStatus>({
    executed: false,
    scheduledDate: null,
    lastRunAt: null,
    hasPartner: false,
  });

  const lastAlertRunAt = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const status = await apiMatchingStatus();

        if (cancelled) return;

        const scheduled =
          status.matchDate || status.scheduledDate || status.dateTime || null;

        const lastRun: string | null = status.lastRunAt || null;

        setState({
          executed: !!status.executed,
          scheduledDate: scheduled,
          lastRunAt: lastRun,
          hasPartner: !!status.hasPartner,
        });

        // ✅ Optional: einmalige Benachrichtigung, wenn Matching gerade lief
        if (lastRun) {
          const lastRunMs = new Date(lastRun).getTime();
          const now = Date.now();

          if (
            now - lastRunMs < 10_000 && // innerhalb der letzten 10 Sek
            lastAlertRunAt.current !== lastRun
          ) {
            Alert.alert(
              "🎅 Silent Santa Matching",
              "Dein Partner wurde soeben ausgelost!"
            );
            lastAlertRunAt.current = lastRun;
          }
        }
      } catch (e) {
        console.log("Error fetching matching status", e);
      }
    }

    // Initialer Call
    fetchStatus();

    // Polling alle 15 Sekunden
    const id = setInterval(fetchStatus, 15_000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <MatchingStatusContext.Provider value={state}>
      {children}
    </MatchingStatusContext.Provider>
  );
}
