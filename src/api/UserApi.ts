import type { User } from "../models/User";

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Adam",
    lastName: "Lewandowski",
    role: "admin",
  },
  {
    id: "2",
    name: "Anna",
    lastName: "Sznajder",
    role: "developer",
  },
  {
    id: "3",
    name: "Sebastian",
    lastName: "Król",
    role: "devops",
  },
];

export class userApi {
  private static instance: userApi;
  private users: User[] = [];
  private currentUser: User | null = null;

  private constructor() {
    this.users = MOCK_USERS;
    this.currentUser = MOCK_USERS[0];
  }

  static getInstance() {
    if (!userApi.instance) {
      userApi.instance = new userApi();
    }
    return userApi.instance;
  }

  getCurrentUser(): User {
    return this.currentUser!;
  }

  getAllUsers(): User[] {
    return this.users;
  }
}
