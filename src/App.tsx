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
} from "./services/TaskService";
import { taskApi } from "./api/TaskApi";
import { TaskForm } from "./components/TaskForm";
import { TaskBoard } from "./components/TaskBoard";
import { useAuth } from "./context/AuthContext";
import { LoginView } from "./components/LoginView";
import { PendingApprovalView } from "./components/PendingApprovalView";
import { BlockedView } from "./components/BlockedView";
import { UserManagementView } from "./components/UserManagementView";
import { authService } from "./services/AuthService";
import { userApi } from "./api/UserApi";
import { notificationService } from "./services/NotificationService";
import { NotificationBell } from "./components/NotificationBell";
import { NotificationDialog } from "./components/NotificationDialog";
import { useNotifications } from "./context/NotificationContext";
import { NotificationsView } from "./components/NotificationView";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useAuth();
  const { refresh: refreshNotifications } = useNotifications();
  const [view, setView] = useState<"main" | "users" | "notifications">("main");

  useEffect(() => {
    const loadProjects = async () => {
      const data = await projectApi.getAll();
      setProjects(data);
    };

    loadProjects();
  }, []);

  const handleAddProject = async (project: Project) => {
    await projectApi.create(project);

    const updated = await projectApi.getAll();
    setProjects(updated);

    const allUsers = await userApi.getAll();

    const adminIds = allUsers
      .filter((u) => u.role === "admin")
      .map((u) => u.id);
    await notificationService.notifyNewProject(adminIds, project.name);
    await refreshNotifications();
  };

  const handleDeleteProject = async (id: string) => {
    await projectApi.delete(id);

    const updated = await projectApi.getAll();
    setProjects(updated);
  };

  const handleUpdateProject = async (project: Project) => {
    await projectApi.update(project);

    const updated = await projectApi.getAll();
    setProjects(updated);
  };

  useEffect(() => {
    const loadActiveProject = async () => {
      const id = await projectApi.getActiveProjectId();
      setActiveProjectId(id);
    };

    loadActiveProject();
  }, []);

  const handleSelectProject = async (id: string) => {
    await projectApi.setActiveProject(id);

    setActiveProjectId(id);
    setActiveStoryId(null);
    setTasks([]);
  };

  useEffect(() => {
    const loadStories = async () => {
      if (activeProjectId) {
        const data = await storyApi.getByProject(activeProjectId);
        setStories(data);
      } else {
        setStories([]);
      }
    };
    loadStories();
  }, [activeProjectId]);

  const handleAddStory = async (story: Story) => {
    await storyApi.create(story);
    if (activeProjectId) {
      const updated = await storyApi.getByProject(activeProjectId);
      setStories(updated);
    }
  };

  const handleDeleteStory = async (id: string) => {
    await storyApi.delete(id);
    if (activeProjectId) {
      const updated = await storyApi.getByProject(activeProjectId);
      setStories(updated);
    }
  };

  const handleUpdateStory = async (story: Story) => {
    await storyApi.update(story);
    if (activeProjectId) {
      const updated = await storyApi.getByProject(activeProjectId);
      setStories(updated);
    }
  };
  const handleSelectStory = (id: string) => {
    setActiveStoryId(id);
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (activeStoryId) {
        const data = await taskApi.getByStory(activeStoryId);
        setTasks(data);
      } else {
        setTasks([]);
      }
    };
    loadTasks();
  }, [activeStoryId]);

  const handleAddTask = async (task: Task) => {
    await taskApi.create(task);
    if (activeStoryId) {
      const updated = await taskApi.getByStory(activeStoryId);
      setTasks(updated);
    }
    const story = await storyApi.getById(task.storyId);
    if (story?.ownerId) {
      await notificationService.notifyTaskAdded(
        story.ownerId,
        task.name,
        story.name,
      );
      await refreshNotifications();
    }
  };

  const handleDeleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    await taskApi.delete(id);
    if (activeStoryId) setTasks(await taskApi.getByStory(activeStoryId));

    if (task) {
      const story = await storyApi.getById(task.storyId);
      if (story?.ownerId) {
        await notificationService.notifyTaskRemoved(
          story.ownerId,
          task.name,
          story.name,
        );
        await refreshNotifications();
      }
    }
  };

  const handleAssignUser = async (task: Task, userId: string) => {
    const updated = assignUser(task, userId);

    await taskApi.update(updated);
    await updateStoryStatus(task.storyId);

    if (activeStoryId) {
      const updated = await taskApi.getByStory(activeStoryId);
      setTasks(updated);
    }
    if (activeProjectId) {
      const updated = await storyApi.getByProject(activeProjectId);
      setStories(updated);
    }

    await notificationService.notifyAssignedToTask(userId, task.name);
    const story = await storyApi.getById(updated.storyId);
    if (story?.ownerId) {
      await notificationService.notifyTaskStatusChange(
        story.ownerId,
        updated.name,
        "doing",
      );
    }
    await refreshNotifications();
  };

  const handleCompleteTask = async (task: Task) => {
    const updated = completeTask(task);

    taskApi.update(updated);
    updateStoryStatus(task.storyId);

    if (activeStoryId) {
      const updated = await taskApi.getByStory(activeStoryId);
      setTasks(updated);
    }
    if (activeProjectId) {
      const updated = await storyApi.getByProject(activeProjectId);
      setStories(updated);
    }

    const story = await storyApi.getById(task.storyId);
    if (story?.ownerId) {
      await notificationService.notifyTaskStatusChange(
        story.ownerId,
        task.name,
        updated.status,
      );
      await refreshNotifications();
    }
  };

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  if (!user) {
    return <LoginView />;
  }

  if (user.isBlocked) {
    return <BlockedView />;
  }

  if (user.role === "guest") {
    return <PendingApprovalView />;
  }

  return (
    <div className={darkMode ? "app-dark min-vh-100" : "app-light min-vh-100"}>
      <NotificationDialog />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            <div className="d-flex align-items-center gap-2">
              <UserInfo />
              <NotificationBell onClick={() => setView("notifications")} />
              {user.role === "admin" && (
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setView("users")}
                >
                  Users
                </button>
              )}

              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setView("main")}
              >
                Home
              </button>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => authService.logout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {view === "users" && user.role === "admin" && <UserManagementView />}
        {view === "notifications" && <NotificationsView />}
        {view === "main" && (
          <>
            <h1 className="text-center mb-4">ManageMe</h1>

            <ProjectForm onAdd={handleAddProject} />

            <ProjectList
              projects={projects}
              onDelete={handleDeleteProject}
              onUpdate={handleUpdateProject}
              onSelect={handleSelectProject}
            />

            {activeProjectId ? (
              <>
                <h2 className="text-center mt-5 mb-3">Stories</h2>

                <StoryForm projectId={activeProjectId} onAdd={handleAddStory} />

                <StoryList
                  stories={stories}
                  onDelete={handleDeleteStory}
                  onUpdate={handleUpdateStory}
                  onSelect={handleSelectStory}
                />

                {activeStoryId && (
                  <>
                    <h3 className="text-center mt-5 mb-3">Tasks</h3>

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
              <p className="text-center mt-4">Choose project</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default App;
