export type Role = "admin" | "devops" | "developer" | "guest";

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
}
