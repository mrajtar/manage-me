import { STORAGE_PROVIDER } from "../config/storage";

import { projectLocalApi } from "./local/ProjectLocalApi";
import { projectFirestoreApi } from "./firestore/ProjectFirestoreApi";

export const projectApi =
  STORAGE_PROVIDER === "firestore"
    ? projectFirestoreApi
    : projectLocalApi;