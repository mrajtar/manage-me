import { useState } from "react";
import type { Story } from "../models/Story";
import { useAuth } from "../context/AuthContext";

type Props = {
  projectId: string;
  onAdd: (story: Story) => void;
};

export const StoryForm = ({ projectId, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const { user } = useAuth();
  if (!user) return null;

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
      ownerId: user.id,
    };

    onAdd(story);
    setName("");
    setDescription("");
    setPriority("low");
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h4 className="mb-3">Add Story</h4>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          className="form-control"
          placeholder="Story name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control"
          placeholder="Story Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="btn btn-primary" type="submit">
          Add Story
        </button>
      </form>
    </div>
  );
};
