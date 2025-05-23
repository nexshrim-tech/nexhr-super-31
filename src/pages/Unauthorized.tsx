
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { profile, isAdmin, isCustomer, isEmployee } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Access Denied</h1>
          <p className="text-gray-500">
            You don't have permission to access this page.
          </p>
          
          {profile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Signed in as:</strong> {profile.full_name || 'User'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Role:</strong> {profile.role}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button onClick={handleGoBack}>
            Go Back
          </Button>
          <Button variant="outline" onClick={handleGoHome}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
