
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexhr-primary"></div>
        <div className="ml-3 text-gray-600">Loading authentication...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!user) {
    console.log('User not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    console.log('Admin access required but user is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
