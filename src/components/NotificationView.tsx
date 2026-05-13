import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import type { Notification } from "../models/Notification";

export function NotificationsView() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [selected, setSelected] = useState<Notification | null>(null);

  const handleSelect = async (n: Notification) => {
    if (!n.isRead) await markAsRead(n.id);
    setSelected({ ...n, isRead: true });
  };

  if (selected) {
    return <NotificationDetail notification={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Notifications</h2>
        {notifications.some((n) => !n.isRead) && (
          <button className="btn btn-sm btn-outline-secondary" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center mt-4">No notifications yet.</p>
      ) : (
        <div className="list-group">
          {notifications.map((n) => (
            <button
              key={n.id}
              className={`list-group-item list-group-item-action ${!n.isRead ? "fw-semibold" : ""}`}
              onClick={() => handleSelect(n)}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex flex-column gap-1">
                  <div className="d-flex align-items-center gap-2">
                    <PriorityBadge priority={n.priority} />
                    <span>{n.title}</span>
                    {!n.isRead && (
                      <span className="badge bg-primary" style={{ fontSize: "0.65rem" }}>
                        New
                      </span>
                    )}
                  </div>
                  <small className="fw-normal">
                    {new Date(n.date).toLocaleString()}
                  </small>
                </div>
                <span style={{ fontSize: "0.8rem" }}>›</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationDetail({
  notification,
  onBack,
}: {
  notification: Notification;
  onBack: () => void;
}) {
  return (
    <div>
      <button className="btn btn-sm btn-outline-secondary mb-3" onClick={onBack}>
        ← Back
      </button>
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-1">
            <PriorityBadge priority={notification.priority} />
            <h5 className="card-title mb-0">{notification.title}</h5>
          </div>
          <p className="small mb-3">
            {new Date(notification.date).toLocaleString()}
          </p>
          <p className="card-text">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  const map = {
    low: "secondary",
    medium: "warning",
    high: "danger",
  } as const;
  return (
    <span className={`badge bg-${map[priority]}`} style={{ fontSize: "0.7rem" }}>
      {priority}
    </span>
  );
}