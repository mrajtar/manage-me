import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import type { User } from "../models/User";
import { userApi } from "../api/UserApi";

type AuthState = {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
};

const Ctx = createContext<AuthState | null>(null);

declare global {
  interface Window {
    __PLAYWRIGHT_TEST_USER__?: boolean;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    const currentUid = window.__PLAYWRIGHT_TEST_USER__
      ? "test-user-123"
      : auth.currentUser?.uid;
    if (!currentUid) return;

    const u = userApi.getById(currentUid) ?? null;
    setUser(u);
  };

  useEffect(() => {
    // ==========================================
    // TEST BACKDOOR: Bypass Firebase entirely
    // ==========================================
    if (window.__PLAYWRIGHT_TEST_USER__) {
      const mockUser: User = {
        id: "test-user-123",
        email: "test@example.com",
        name: "Playwright",
        lastName: "Tester",
        role: "admin",
        isBlocked: false,
        createdAt: new Date().toISOString(),
      };

      userApi.upsert(mockUser);
      setUser(mockUser);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (fb) => {
      if (!fb) {
        setUser(null);
        setLoading(false);
        return;
      }
      const u = userApi.getById(fb.uid) ?? null;
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
