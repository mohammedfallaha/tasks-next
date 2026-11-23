"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/lib/types";

const STORAGE_KEY = "tasks-next-session";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Runs in the browser only, after the first render. The server has no localStorage.
    const saved = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved !== null) setSession(JSON.parse(saved) as Session);
    setReady(true);
  }, []);

  function saveSession(next: Session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }
  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }
  return { session, ready, saveSession, clearSession };
}