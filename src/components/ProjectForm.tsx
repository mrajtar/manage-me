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
    <div className="card p-4 mb-4 shadow-sm">
      <h3 className="mb-3">Add project</h3>
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <input
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        required
      />
      <input
        className="form-control"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
        required
      />
      <button className="btn btn-primary" type="submit">Add project</button>
    </form>
    </div>
  );
};
