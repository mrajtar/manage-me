import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../config/firebase";
import type { Story } from "../../models/Story";

const COLLECTION = "stories";

export const storyFirestoreApi = {
  async getAll(): Promise<Story[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Story));
  },

  async getById(id: string) : Promise<Story>{
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return {id: docSnap.id, ... docSnap.data()} as Story;
  },

  async getByProject(projectId: string) : Promise<Story[]> {
    const q = query(collection(db, COLLECTION), where("projectId", "==", projectId))
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    } as Story));
  },

  async create(story: any) {
    const docRef = doc(db, COLLECTION, story.id);
    await setDoc(docRef, story);
  },

  async update(story: any) {
    const docRef = doc(db, COLLECTION, story.id);
    await updateDoc(docRef, { ...story });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};