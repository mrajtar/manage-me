import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../config/firebase";
import type { Project } from "../../models/Project";

const COLLECTION = "projects";
const ACTIVE_PROJECT_KEY = "activeProjectId";

export const projectFirestoreApi = {
  async getAll(): Promise<Project[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Project));
  },

  async create(project: any) {
    const docRef = doc(db, COLLECTION, project.id);
    await setDoc(docRef, project);
  },

  async update(project: any) {
    const docRef = doc(db, COLLECTION, project.id);
    await updateDoc(docRef, { ...project });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async setActiveProject(id: string): Promise<void> {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    return Promise.resolve();
  },

  async getActiveProjectId(): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(ACTIVE_PROJECT_KEY));
  },
};