import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession.tsx";

const ProtectedRoute = () => {
  const { auth } = useSession();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
