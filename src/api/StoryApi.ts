import type { Story } from "../models/Story";

const STORAGE_KEY = "stories";

export const storyApi = {
  getAll(): Story[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(stories: Story[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  },

  getByProject(projectId: string): Story[] {
    return this.getAll().filter(s => s.projectId === projectId);
  },

  create(story: Story) {
    const stories = this.getAll();
    stories.push(story);
    this.saveAll(stories);
  },

  update(updated: Story) {
    const stories = this.getAll().map(s =>
      s.id === updated.id ? updated : s
    );
    this.saveAll(stories);
  },

  delete(id: string) {
    const stories = this.getAll().filter(s => s.id !== id);
    this.saveAll(stories);
  }
};