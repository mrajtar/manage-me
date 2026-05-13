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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    if (!auth.currentUser) return;
    const u = userApi.getById(auth.currentUser.uid) ?? null;
    setUser(u);
  };

  useEffect(() => {
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

  return <Ctx.Provider value={{ user, loading, refreshUser }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};