import { useState } from "react";
import type { Task } from "../models/Task";

type Props = {
  storyId: string;
  onAdd: (task: Task) => void;
};

export const TaskForm = ({ storyId, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [hours, setHours] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const task: Task = {
      id: crypto.randomUUID(),
      name,
      description,
      priority: priority as any,
      storyId,
      estimatedHours: hours,
      spentHours: 0,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    onAdd(task);

    setName("");
    setDescription("");
    setPriority("medium");
    setHours(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(+e.target.value)}
      />
      <select onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button>Add task</button>
    </form>
  );
};
