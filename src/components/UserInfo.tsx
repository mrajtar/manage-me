import { useAuth } from "../context/AuthContext";

export const UserInfo = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="text-white fw-semibold">
      {user.name} {user.lastName}, {user.role}
    </div>
  );
};