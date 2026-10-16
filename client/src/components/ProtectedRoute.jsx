import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

// Restricts access to logged-in users. Unauthenticated users are sent to /login,
// and after login they are redirected back to the page they asked for (location.state.from).
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading text="Checking your session..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Works both as a wrapper (<ProtectedRoute><Page/></ProtectedRoute>) and as a layout route
  return children ?? <Outlet />;
}
