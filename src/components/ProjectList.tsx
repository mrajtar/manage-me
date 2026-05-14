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
    <div className="d-flex flex-column gap-3 mb-5">
      {projects.map((p) => (
        <div key={p.id}className="card-shadow-sm p-3">
        <div className="d-flex align-items-center flex-wrap gap-3">
            <h5 className="mb-1">Name: {p.name}</h5>
              Description: {p.description}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onSelect(p.id)}>Select</button>
          <button className="btn btn-primary btn-sm" onClick={() => handleEdit(p)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(p.id)}>Delete</button>
        </div>
        </div>
      ))}
    </div>
  );
};
