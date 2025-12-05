import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  require_auth?: boolean;
}

const ProtectedRoute = ({ children, require_auth = true }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

 if (auth.loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}


  if (require_auth && !auth.active) {
    return <Navigate to="/signin" replace />;
  }

  if (!require_auth && auth.active) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
