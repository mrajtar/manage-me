import { STORAGE_PROVIDER } from "../config/storage";

import { taskLocalApi } from "./local/TaskLocalApi";
import { taskFirestoreApi } from "./firestore/TaskFirestoreApi";

export const taskApi = STORAGE_PROVIDER === "firestore" 
  ? taskFirestoreApi 
  : taskLocalApi;