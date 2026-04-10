import { useState } from "react";
import type { Story } from "../models/Story";
import { userApi } from "../api/UserApi";

type Props = {
  projectId: string;
  onAdd: (story: Story) => void;
};

export const StoryForm = ({ projectId, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const user = userApi.getInstance().getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const story: Story = {
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      projectId: projectId,
      createdAt: new Date().toISOString(),
      status: "todo",
      ownerId: user.id
    };

    onAdd(story);
    setName("");
    setDescription("");
    setPriority("low")
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={description} onChange={e => setDescription(e.target.value)} />
      <select onChange={e => setPriority(e.target.value as any)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
};