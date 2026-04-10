import { userApi } from "../api/UserApi";

export const UserInfo = () => {
  const user = userApi.getInstance().getCurrentUser();

  return (
    <div>
        {user.name} {user.lastName}
    </div>
  );
};