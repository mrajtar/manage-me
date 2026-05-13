import type { Task } from "../models/Task";
import { userApi } from "../api/UserApi";

type Props = {
  task: Task;
  onUpdate: (task: Task) => void;
};

export const TaskDetails = ({ task, onUpdate }: Props) => {
  const users = userApi
    .getAll()
    .filter((u) => u.role !== "admin");

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h3 className="mb-2">{task.name}</h3>
      <p className="text-muted mb-3">{task.description}</p>

      <div className="mb-4">
        <strong>Status: </strong>
        <span className="badge bg-secondary">{task.status}</span>
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center">
        <select
          className="form-select w-auto"
          defaultValue=""
          onChange={(e) =>
            onUpdate({
              ...task,
              ownerId: e.target.value,
              status: "doing",
              startedAt: new Date().toISOString(),
            })
          }>
          <option value="" disabled>
            Assign user
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-success"
          onClick={() =>
            onUpdate({
              ...task,
              status: "done",
              finishedAt: new Date().toISOString(),
            })
          }>
          Mark as done
        </button>
      </div>
    </div>
  );
};
