import { useState } from "react";
import type { Project } from "../models/Project";

type Props = {
  onAdd: (project: Project) => void;
};

export const ProjectForm = ({ onAdd }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
    };

    onAdd(newProject);
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};
