export interface Task {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyId: string;
  estimatedHours: number;
  spentHours: number;
  status: "todo" | "doing" | "done";
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  ownerId?: string;
}
