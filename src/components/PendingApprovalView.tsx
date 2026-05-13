import { authService } from "../services/AuthService";

export const PendingApprovalView = () => (
  <div className="container py-5">
    <div className="alert alert-info d-flex flex-column gap-3">
      <div>
        <h4>Pending approval</h4>
        <p className="mb-0">
          Your account currently has a guest role. You can't use the app until
          an administrator has approved your account.
        </p>
      </div>

      <div>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => authService.logout()}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);