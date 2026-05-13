import type { Notification } from "../../models/Notification";

const STORAGE_KEY = "notifications";

export const notificationLocalApi = {
  async getAll(): Promise<Notification[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async getByRecipient(userId: string): Promise<Notification[]> {
    const all = await this.getAll();
    return all.filter((n) => n.recipientId === userId);
  },

  async create(notification: Notification): Promise<void> {
    const all = await this.getAll();
    all.push(notification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  async update(updated: Notification): Promise<void> {
    const all = await this.getAll();
    const index = all.findIndex((n) => n.id === updated.id);
    if (index !== -1) {
      all[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  },

  async markAsRead(id: string): Promise<void> {
    const all = await this.getAll();
    const note = all.find((n) => n.id === id);
    if (note) {
      note.isRead = true;
      await this.update(note);
    }
  }
};