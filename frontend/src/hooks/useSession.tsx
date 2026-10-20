import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/api/http.ts";
import { authStorage } from "@/lib/authStorage.ts";
import type { StoredAuth } from "@/types/auth.type.ts";

interface SessionValue {
  auth: StoredAuth | null;
  signIn: (auth: StoredAuth) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [auth, setAuth] = useState<StoredAuth | null>(authStorage.get);

  const signIn = useCallback((next: StoredAuth) => {
    queryClient.clear();
    authStorage.set(next);
    setAuth(next);
  }, [queryClient]);

  const signOut = useCallback(() => {
    authStorage.clear();
    queryClient.clear();
    setAuth(null);
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo(() => ({ auth, signIn, signOut }), [auth, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}