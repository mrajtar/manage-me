import type { Project } from "../models/Project";

const STORAGE_KEY = "projects";
const ACTIVE_PROJECT_KEY = "activeProjectId";

export const projectApi = {
  getAll(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(projects: Project[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  create(project: Project): Project {
    const projects = this.getAll();
    projects.push(project);
    this.saveAll(projects);
    return project;
  },

  update(updatedProject: Project): Project {
    const projects = this.getAll().map(p =>
      p.id === updatedProject.id ? updatedProject : p
    );
    this.saveAll(projects);
    return updatedProject;
  },

  delete(id: string): void {
    const projects = this.getAll().filter(p => p.id !== id);
    this.saveAll(projects);
  },

  getById(id: string): Project | undefined {
    return this.getAll().find(p => p.id === id);
  },

  setActiveProject(id: string) {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  },

  getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }
};