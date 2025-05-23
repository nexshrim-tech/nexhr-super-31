
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (user) {
    // Redirect to home if already authenticated
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
