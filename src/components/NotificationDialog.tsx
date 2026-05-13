import { useNotifications } from "../context/NotificationContext";
import { PriorityBadge } from "./NotificationView";

export function NotificationDialog() {
  const { dialogNotification, dismissDialog, markAsRead } = useNotifications();

  if (!dialogNotification) return null;

  const isHigh = dialogNotification.priority === "high";

  const handleMarkAndDismiss = async () => {
    await markAsRead(dialogNotification.id);
    dismissDialog();
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div
            className={`modal-header ${isHigh ? "bg-danger text-white" : "bg-warning"}`}
          >
            <h5 className="modal-title d-flex align-items-center gap-2">
              <PriorityBadge priority={dialogNotification.priority} />
              {dialogNotification.title}
            </h5>
            <button
              type="button"
              className={`btn-close ${isHigh ? "btn-close-white" : ""}`}
              onClick={dismissDialog}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <p className="mb-1">{dialogNotification.message}</p>
            <small>
              {new Date(dialogNotification.date).toLocaleString()}
            </small>
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary btn-sm" onClick={handleMarkAndDismiss}>
              Mark as read
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={dismissDialog}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}