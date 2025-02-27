import useAuth from "@/hooks/states/useAuth";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthMiddleware = () => {
  const { auth } = useAuth((state) => state);

  if (!auth) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AuthMiddleware;
