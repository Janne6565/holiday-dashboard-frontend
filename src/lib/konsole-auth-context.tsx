import { verifyKonsolePassword } from "@/api/axios-instance";
import {
  clearStoredKonsolePassword,
  getStoredKonsolePassword,
  setStoredKonsolePassword,
} from "@/lib/konsole-auth";
import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";

interface KonsoleAuthValue {
  /** True once a correct password has been entered this session. */
  unlocked: boolean;
  /** Verify the password against the backend; stores it and unlocks on success. */
  unlock: (password: string) => Promise<boolean>;
  /** Forget the password and re-lock. */
  lock: () => void;
}

const KonsoleAuthContext = createContext<KonsoleAuthValue | null>(null);

export function KonsoleAuthProvider({ children }: { children: ReactNode }) {
  // Seed from sessionStorage so a reload during an unlocked session stays unlocked.
  const [unlocked, setUnlocked] = useState(() => getStoredKonsolePassword() !== null);

  const unlock = useCallback(async (password: string) => {
    const ok = await verifyKonsolePassword(password);
    if (ok) {
      setStoredKonsolePassword(password);
      setUnlocked(true);
    }
    return ok;
  }, []);

  const lock = useCallback(() => {
    clearStoredKonsolePassword();
    setUnlocked(false);
  }, []);

  const value = useMemo(() => ({ unlocked, unlock, lock }), [unlocked, unlock, lock]);

  return <KonsoleAuthContext.Provider value={value}>{children}</KonsoleAuthContext.Provider>;
}

export function useKonsoleAuth(): KonsoleAuthValue {
  const ctx = useContext(KonsoleAuthContext);
  if (!ctx) {
    throw new Error("useKonsoleAuth must be used within a KonsoleAuthProvider");
  }
  return ctx;
}
