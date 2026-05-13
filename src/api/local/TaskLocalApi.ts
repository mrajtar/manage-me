import type { Task } from "../../models/Task";

const STORAGE_KEY = "tasks";

export const taskLocalApi = {
  getAll(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  getByStory(storyId: string): Task[] {
    return this.getAll().filter((t) => t.storyId === storyId);
  },

  create(task: Task) {
    const tasks = this.getAll();
    tasks.push(task);
    this.saveAll(tasks);
  },

  update(updated: Task) {
    const tasks = this.getAll().map((t) => (t.id === updated.id ? updated : t));
    this.saveAll(tasks);
  },

  delete(id: string) {
    const tasks = this.getAll().filter((t) => t.id !== id);
    this.saveAll(tasks);
  },
};
