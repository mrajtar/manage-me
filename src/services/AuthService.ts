import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { SUPER_ADMIN_EMAIL } from "../config/appConfig";
import type { User } from "../models/User";
import { userApi } from "../api/UserApi";

const splitName = (displayName?: string | null) => {
  const parts = (displayName ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    name: parts[0] ?? "User",
    lastName: parts.slice(1).join(" ") ?? "",
  };
};

export const authService = {
  async loginWithGoogle(): Promise<User> {
    const res = await signInWithPopup(auth, googleProvider);
    const fbUser = res.user;

    const email = fbUser.email ?? "";
    const { name, lastName } = splitName(fbUser.displayName);

    const existing = userApi.getById(fbUser.uid);

    if (existing) return existing;

    const role =
      email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
        ? "admin"
        : "guest";

    const created: User = {
      id: fbUser.uid,
      email,
      name,
      lastName,
      role,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    userApi.upsert(created);

    return created;
  },

  async logout() {
    await signOut(auth);
  },
};
