import { authService } from "../services/AuthService";

export const BlockedView = () => (
  <div className="container py-5">
    <div className="alert alert-danger">
      <h4>Account blocked</h4>
      <p className="mb-0">You don't have access to the app.</p>
    </div>
    <div>
        <button className="btn btn-outline-primary btn-sm"onClick={() => authService.logout()}>Logout</button>
    </div>
  </div>
);