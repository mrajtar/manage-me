import { useEffect, useState } from "react";
import type { Project } from "./models/Project";
import { projectApi } from "./api/ProjectApi";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectApi.getAll());
  }, []);

  const handleAdd = (project: Project) => {
    projectApi.create(project);
    setProjects(projectApi.getAll());
  };

  const handleDelete = (id: string) => {
    projectApi.delete(id);
    setProjects(projectApi.getAll());
  };

  const handleUpdate = (project: Project) => {
    projectApi.update(project);
    setProjects(projectApi.getAll());
  };

  return (
    <div>
      <h1>ManageMe</h1>
      <ProjectForm onAdd={handleAdd} />
      <ProjectList
        projects={projects}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;