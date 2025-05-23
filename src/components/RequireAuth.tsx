
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'customer' | 'employee'>;
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Render a loading state while checking authentication
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access if allowedRoles is provided
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to unauthorized page or dashboard based on user role
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
