import { useState } from "react";
import type { Role } from "../models/User";
import { userApi } from "../api/UserApi";
import { useAuth } from "../context/AuthContext";

export const UserManagementView = () => {
  const { refreshUser } = useAuth();
  const [users, setUsers] = useState(userApi.getAll());

  const refresh = () => setUsers(userApi.getAll());

  const changeRole = (id: string, role: Role) => {
    userApi.setRole(id, role);
    refresh();
  };

  const toggleBlock = (id: string, blocked: boolean) => {
    userApi.setBlocked(id, blocked);
    refresh();
    refreshUser();
  };

  return (
    <div className="card p-3 shadow-sm">
      <h4 className="mb-3">Users</h4>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Blocked</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>
                  {u.name} {u.lastName}
                </td>
                <td style={{ maxWidth: 180 }}>
                  <select
                    className="form-select form-select-sm"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value as Role)}
                    disabled={u.isBlocked}>
                    <option value="guest">guest</option>
                    <option value="developer">developer</option>
                    <option value="devops">devops</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={u.isBlocked}
                      onChange={(e) => toggleBlock(u.id, e.target.checked)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
