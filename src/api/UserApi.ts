import type { User } from "../models/User";

const MOCK_USER: User = {
  id: "1",
  name: "Adam",
  lastName: "Lewandowski"
};

export class userApi {
  private static instance: userApi;
  private currentUser: User | null = null;

  private constructor() {
    this.currentUser = MOCK_USER;
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
}