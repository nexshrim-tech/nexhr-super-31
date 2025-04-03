
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useRequireAuth = (redirectPath: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);

  return { isAuthenticated, isLoading };
};
