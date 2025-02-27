import useAuth from "@/hooks/states/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { auth } = useAuth((state) => state);

  if (!auth) return <Navigate to="/login" />;

  return <Outlet />;
};

export default AuthLayout;
