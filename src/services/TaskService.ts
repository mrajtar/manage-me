import type { Task } from "../models/Task";
import { taskApi } from "../api/TaskApi";
import { storyApi } from "../api/StoryApi";

export const assignUser = (task: Task, userId: string): Task => {
  return {
    ...task,
    ownerId: userId,
    status: "doing",
    startedAt: new Date().toISOString(),
  };
};

export const completeTask = (task: Task): Task => {
  return {
    ...task,
    status: "done",
    finishedAt: new Date().toISOString(),
  };
};

export const updateStoryStatus = (storyId: string) => {
  const tasks = taskApi.getByStory(storyId);

  if (tasks.length === 0) return;

  const allDone = tasks.every((t) => t.status === "done");
  const anyDoing = tasks.some((t) => t.status === "doing");

  const story = storyApi.getById(storyId);
  if (!story) return;

  if (allDone && story.status !== "done") {
    storyApi.update({ ...story, status: "done" });
    return;
  }

  if (anyDoing && story.status === "todo") {
    storyApi.update({ ...story, status: "doing" });
  }
};
