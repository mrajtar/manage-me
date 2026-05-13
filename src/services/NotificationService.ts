import { notificationApi } from "../api/NotificationApi";
import type { Notification } from "../models/Notification";

function build(
  recipientId: string,
  title: string,
  message: string,
  priority: "low" | "medium" | "high",
): Notification {
  return {
    id: crypto.randomUUID(),
    title,
    message,
    date: new Date().toISOString(),
    priority,
    isRead: false,
    recipientId,
  };
}

export const notificationService = {
  async notifyNewProject(adminIds: string[], projectName: string) {
    for (const id of adminIds) {
      await notificationApi.create(
        build(
          id,
          "New project created",
          `Project "${projectName}" has been created.`,
          "high",
        ),
      );
    }
  },

  async notifyAssignedToStory(userId: string, storyName: string) {
    await notificationApi.create(
      build(
        userId,
        "Story assignation",
        `You have been assigned to story: "${storyName}".`,
        "high",
      ),
    );
  },

  async notifyAssignedToTask(userId: string, taskName: string) {
    await notificationApi.create(
      build(
        userId,
        "Task assignation",
        `You have been assigned to task: "${taskName}".`,
        "high",
      ),
    );
  },

  async notifyTaskAdded(
    storyOwnerId: string,
    taskName: string,
    storyName: string,
  ) {
    await notificationApi.create(
      build(
        storyOwnerId,
        "New task",
        `Task "${taskName}" was added to story "${storyName}".`,
        "medium",
      ),
    );
  },

  async notifyTaskRemoved(
    storyOwnerId: string,
    taskName: string,
    storyName: string,
  ) {
    await notificationApi.create(
      build(
        storyOwnerId,
        "Task removal",
        `Task "${taskName}" was removed from story "${storyName}".`,
        "medium",
      ),
    );
  },

  async notifyTaskStatusChange(
    storyOwnerId: string,
    taskName: string,
    status: "todo" | "doing" | "done",
  ) {
    if (status === "done") {
      await notificationApi.create(
        build(
          storyOwnerId,
          "Task completed",
          `Task "${taskName}" has been marked as done.`,
          "medium",
        ),
      );
    } else if (status === "doing") {
      await notificationApi.create(
        build(
          storyOwnerId,
          "Task started",
          `Task "${taskName}" is now in progress.`,
          "low",
        ),
      );
    }
  },
};
