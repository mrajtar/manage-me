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
    .getInstance()
    .getAllUsers()
    .filter((u) => u.role === "developer" || u.role === "devops");

  return (
    <div style={{ width: "100%" }}>
      <h3 style={{ textAlign: "center" }}>Kanban</h3>

      <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
        {Object.entries(grouped).map(([status, items]) => (
          <div
            key={status}
            style={{
              minWidth: 260,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 10,
            }}
          >
            <h4 style={{ textAlign: "center" }}>{status.toUpperCase()}</h4>

            {items.length === 0 && (
              <p style={{ textAlign: "center", opacity: 0.6 }}>brak</p>
            )}

            {items.map((t) => (
              <div
                key={t.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {t.name} ({t.priority})
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {t.description}
                </div>

                <div style={{ fontSize: 12, marginTop: 6 }}>
                  est: {t.estimatedHours}h • spent: {t.spentHours}h
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button onClick={() => onDelete(t.id)}>Delete</button>

                  {t.status === "todo" && (
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        const userId = e.target.value;
                        if (userId) onAssignUser(t, userId);
                        e.currentTarget.value = "";
                      }}
                    >
                      <option value="">Assign user…</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} {u.lastName} ({u.role})
                        </option>
                      ))}
                    </select>
                  )}

                  {t.status !== "done" && (
                    <button onClick={() => onComplete(t)}>Mark done</button>
                  )}
                </div>

                <div style={{ fontSize: 11, marginTop: 8, opacity: 0.8 }}>
                  created: {new Date(t.createdAt).toLocaleString()}
                  {t.startedAt && (
                    <> • start: {new Date(t.startedAt).toLocaleString()}</>
                  )}
                  {t.finishedAt && (
                    <> • end: {new Date(t.finishedAt).toLocaleString()}</>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
