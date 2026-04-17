import { useEffect, useState } from "react";
import type { Project } from "./models/Project";
import type { Story } from "./models/Story";
import { projectApi } from "./api/ProjectApi";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";
import { storyApi } from "./api/StoryApi";
import { StoryList } from "./components/StoryList";
import { StoryForm } from "./components/StoryForm";
import { UserInfo } from "./components/UserInfo";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

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

  useEffect(() => {
  setActiveProjectId(projectApi.getActiveProjectId());
  }, []);

  const handleSelect = (id: string) => {
  projectApi.setActiveProject(id);
  setActiveProjectId(id);
  };

  useEffect(() => {
  if (activeProjectId) {
    setStories(storyApi.getByProject(activeProjectId));
  } else {
    setStories([]);
  }
  }, [activeProjectId]);

  const handleAddStory = (story: Story) => {
  storyApi.create(story);
  if (activeProjectId) {
    setStories(storyApi.getByProject(activeProjectId));
  }
};

const handleDeleteStory = (id: string) => {
  storyApi.delete(id);
  if (activeProjectId) {
    setStories(storyApi.getByProject(activeProjectId));
  }
};

const handleUpdateStory = (story: Story) => {
  storyApi.update(story);
  if (activeProjectId) {
    setStories(storyApi.getByProject(activeProjectId));
  }
};

  return (
    <div>
      <div style={{ position: "absolute", top: 10, right: 20}}>
        <UserInfo />
      </div>
      <h1>ManageMe</h1>
      <ProjectForm onAdd={handleAdd} />
      <ProjectList
        projects={projects}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onSelect={handleSelect}
      />
      {activeProjectId ? (
      <>
      <h2>Stories</h2>
      <StoryForm projectId={activeProjectId} onAdd={handleAddStory} />
      <StoryList
        stories={stories}
        onDelete={handleDeleteStory}
        onUpdate={handleUpdateStory}
      />
      </>
      ) : (
        <p>Choose</p>
      )}
    </div>
  );
}

export default App;