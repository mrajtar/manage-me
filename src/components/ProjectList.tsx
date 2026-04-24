import type { Project } from "../models/Project";

type Props = {
  projects: Project[];
  onDelete: (id: string) => void;
  onUpdate: (project: Project) => void;
  onSelect: (id: string) => void;
};

export const ProjectList = ({
  projects,
  onDelete,
  onUpdate,
  onSelect,
}: Props) => {
  const handleEdit = (project: Project) => {
    const name = prompt("New name:", project.name);
    const description = prompt("New description:", project.description);

    if (name && description) {
      onUpdate({ ...project, name, description });
    }
  };

  return (
    <ul>
      {projects.map((p) => (
        <li key={p.id}>
          <strong>{p.name}</strong> - {p.description}
          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => onDelete(p.id)}>Delete</button>
          <button onClick={() => onSelect(p.id)}>Choose</button>
        </li>
      ))}
    </ul>
  );
};
