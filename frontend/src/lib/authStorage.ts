import type { StoredAuth } from "@/types/auth.type.ts";

const KEY = "pushtalk.auth";

export const authStorage = {
  get(): StoredAuth | null {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
      return null;
    }
  },
  set(auth: StoredAuth): void {
    sessionStorage.setItem(KEY, JSON.stringify(auth));
  },
  clear(): void {
    sessionStorage.removeItem(KEY);
  },
};
