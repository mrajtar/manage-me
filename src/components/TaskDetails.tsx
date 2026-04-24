import type { Task } from "../models/Task";
import { userApi } from "../api/UserApi";

type Props = {
  task: Task;
  onUpdate: (task: Task) => void;
};

export const TaskDetails = ({ task, onUpdate }: Props) => {
  const users = userApi
    .getInstance()
    .getAllUsers()
    .filter((u) => u.role !== "admin");

  return (
    <div>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>

      <select
        onChange={(e) =>
          onUpdate({
            ...task,
            ownerId: e.target.value,
            status: "doing",
            startedAt: new Date().toISOString(),
          })
        }
      >
        <option>Assign user</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          onUpdate({
            ...task,
            status: "done",
            finishedAt: new Date().toISOString(),
          })
        }
      >
        Mark as done
      </button>
    </div>
  );
};
