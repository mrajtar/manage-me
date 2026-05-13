import { useNotifications } from "../context/NotificationContext";

interface Props {
  onClick: () => void;
}

export function NotificationBell({ onClick }: Props) {
  const { unreadCount } = useNotifications();

  return (
    <button
      className="btn btn-outline-light btn-sm position-relative"
      onClick={onClick}
      title="Notifications"
    >
      🔔
      {unreadCount > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: "0.65rem" }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}