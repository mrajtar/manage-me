import type { Role, User } from "../models/User";

const STORAGE_KEY = "users";

export const userApi = {
  getAll(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  },

  saveAll(users: User[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  getById(id: string): User | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  getByEmail(email: string): User | undefined {
    return this.getAll().find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  },

  upsert(user: User): User {
    const all = this.getAll();
    const idx = all.findIndex((u) => u.id === user.id);
    if (idx >= 0) all[idx] = user;
    else all.unshift(user);
    this.saveAll(all);
    return user;
  },

  setRole(userId: string, role: Role) {
    const all = this.getAll().map((u) =>
      u.id === userId ? { ...u, role } : u,
    );
    this.saveAll(all);
  },

  setBlocked(userId: string, isBlocked: boolean) {
    const all = this.getAll().map((u) =>
      u.id === userId ? { ...u, isBlocked } : u,
    );
    this.saveAll(all);
  },

};
