import { STORAGE_PROVIDER } from "../config/storage";

import { storyLocalApi } from "./local/StoryLocalApi";
import { storyFirestoreApi } from "./firestore/StoryFirestoreApi";

export const storyApi =
  STORAGE_PROVIDER === "firestore"
    ? storyFirestoreApi
    : storyLocalApi;