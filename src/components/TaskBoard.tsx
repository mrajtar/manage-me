import type { Task } from "../models/Task";
import { userApi } from "../api/UserApi";

type Props = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onAssignUser: (task: Task, userId: string) => void;
  onComplete: (task: Task) => void;
};

export const TaskBoard = ({
  tasks,
  onDelete,
  onAssignUser,
  onComplete,
}: Props) => {
  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const users = userApi
    .getAll()
    .filter((u) => u.role === "developer" || u.role === "devops" || u.role === "admin");

  return (
    <div className="w-100 mb-5">
      <div className="d-flex gap-4 justify-content-center flex-wrap">
        {Object.entries(grouped).map(([status, items]) => (
          <div
            key={status}
            className="card border p-3"
            style={{ minWidth: "280px", flex: "1 1 0" }}
          >
            <h4 className="text-center mb-3 text-uppercase">{status}</h4>

            <div className="d-flex flex-column gap-3">
              {items.map((t) => (
                <div key={t.id} className="card p-3 shadow-sm border-0">
                  <div className="fw-bold mb-1">
                    {t.name}{" "}
                    <span className="badge bg-secondary ms-1">
                      {t.priority}
                    </span>
                  </div>
                  <div className="small mb-2">{t.description}</div>

                  <div className="small mb-3">
                    <strong>est:</strong> {t.estimatedHours}h &bull;{" "}
                    <strong>spent:</strong> {t.spentHours}h
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    {t.status === "todo" && (
                      <select
                        className="form-select form-select-sm w-auto"
                        defaultValue=""
                        onChange={(e) => {
                          const userId = e.target.value;
                          if (userId) onAssignUser(t, userId);
                          e.currentTarget.value = "";
                        }}>
                        <option value="">Assign user</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} {u.lastName} ({u.role})
                          </option>
                        ))}
                      </select>
                    )}

                    {t.status !== "done" && (
                      <button className="btn btn-success btn-sm" onClick={() => onComplete(t)}>Mark done</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}>Delete</button>
                  </div>

                  <div className="mt-3" style={{ fontSize: "0.7rem" }}>
                    <div>created: {new Date(t.createdAt).toLocaleString()}</div>
                    {t.startedAt && (
                      <div>start: {new Date(t.startedAt).toLocaleString()}</div>
                    )}
                    {t.finishedAt && (
                      <div>end: {new Date(t.finishedAt).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
