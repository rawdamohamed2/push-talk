import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/context/useSession.tsx";

const GuestRoute = () => {
  const { auth } = useSession();
  const location = useLocation();

  if (auth) {
    return <Navigate to="/channels" replace state={{ from: location }} />;
  }
  return <Outlet />;
};
export default GuestRoute;
