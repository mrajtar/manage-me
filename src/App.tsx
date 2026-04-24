import { useEffect, useState } from "react";
import type { Project } from "./models/Project";
import type { Story } from "./models/Story";
import type { Task } from "./models/Task";
import { projectApi } from "./api/ProjectApi";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";
import { storyApi } from "./api/StoryApi";
import { StoryList } from "./components/StoryList";
import { StoryForm } from "./components/StoryForm";
import { UserInfo } from "./components/UserInfo";
import {
  assignUser,
  completeTask,
  updateStoryStatus,
} from "./services/taskService";
import { taskApi } from "./api/TaskApi";
import { TaskForm } from "./components/TaskForm";
import { TaskBoard } from "./components/TaskBoard";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

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
    setActiveStoryId(null);
    setTasks([]);
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
  const handleSelectStory = (id: string) => {
    setActiveStoryId(id);
  };

  useEffect(() => {
    if (activeStoryId) {
      setTasks(taskApi.getByStory(activeStoryId));
    } else {
      setTasks([]);
    }
  }, [activeStoryId]);

  const handleAddTask = (task: Task) => {
    taskApi.create(task);
    if (activeStoryId) {
      setTasks(taskApi.getByStory(activeStoryId));
    }
  };

  const handleDeleteTask = (id: string) => {
    taskApi.delete(id);
    if (activeStoryId) {
      setTasks(taskApi.getByStory(activeStoryId));
    }
  };

  const handleAssignUser = (task: Task, userId: string) => {
    const updated = assignUser(task, userId);

    taskApi.update(updated);
    updateStoryStatus(task.storyId);

    if (activeStoryId) {
      setTasks(taskApi.getByStory(activeStoryId));
    }
    if (activeProjectId) {
      setStories(storyApi.getByProject(activeProjectId));
    }
  };

  const handleCompleteTask = (task: Task) => {
    const updated = completeTask(task);

    taskApi.update(updated);
    updateStoryStatus(task.storyId);

    if (activeStoryId) {
      setTasks(taskApi.getByStory(activeStoryId));
    }
    if (activeProjectId) {
      setStories(storyApi.getByProject(activeProjectId));
    }
  };

  return (
    <div>
      <div style={{ position: "absolute", top: 10, right: 20 }}>
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
            onSelect={handleSelectStory}
          />
          {activeStoryId && (
            <>
              <h3>Tasks</h3>
              <TaskForm storyId={activeStoryId} onAdd={handleAddTask} />
              <TaskBoard
                tasks={tasks}
                onDelete={handleDeleteTask}
                onAssignUser={handleAssignUser}
                onComplete={handleCompleteTask}
              />
            </>
          )}
        </>
      ) : (
        <p>Choose</p>
      )}
    </div>
  );
}

export default App;
