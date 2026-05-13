import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Notification } from "../../models/Notification";

const COLLECTION = "notifications";

export const notificationFirestoreApi = {
  async getByRecipient(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, COLLECTION),
      where("recipientId", "==", userId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Notification,
    );
  },

  async create(notification: Notification) {
    await setDoc(doc(db, COLLECTION, notification.id), notification);
  },

  async getAll(): Promise<Notification[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
  },

  async update(updated: Notification): Promise<void> {
    const docRef = doc(db, COLLECTION, updated.id);
    await updateDoc(docRef, { ...updated });
  },

  async markAsRead(id: string) {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { isRead: true });
  },
};
