import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../config/firebase";
import type { Task } from "../../models/Task";

const COLLECTION = "tasks";

export const taskFirestoreApi = {
  async getAll(): Promise<Task[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Task));
  },

  async getByStory(storyId: string): Promise<Task[]> {
    const q = query(collection(db, COLLECTION), where("storyId", "==", storyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Task));
  },

  async create(task: Task): Promise<void> {
    const docRef = doc(db, COLLECTION, task.id);
    await setDoc(docRef, task);
  },

  async update(task: Task): Promise<void> {
    const docRef = doc(db, COLLECTION, task.id);
    await updateDoc(docRef, { ...task });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};