import { STORAGE_PROVIDER } from "../config/storage";

import { notificationLocalApi } from "./local/NotificationLocalApi";
import { notificationFirestoreApi } from "./firestore/NotificationFirestoreApi";

export const notificationApi =
  STORAGE_PROVIDER === "firestore"
    ? notificationFirestoreApi
    : notificationLocalApi;