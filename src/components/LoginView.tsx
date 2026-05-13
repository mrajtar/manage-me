import { authService } from "../services/AuthService";
import { useAuth } from "../context/AuthContext";

export const LoginView = () => {

const { refreshUser } = useAuth();

const handleLogin = async () => {
  try {
    await authService.loginWithGoogle();
    refreshUser
  } catch (error) {
    console.error("Login failed:", error);
  }
};


  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 420 }}>
        <h3 className="mb-3">Sign in</h3>
        <button className="btn btn-primary"  onClick={handleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
};