
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { resetUserState, fetchUserProfile } from '@/utils/authUtils';
import { useAuthOperations } from '@/hooks/useAuthOperations';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  customerId: number | null;
  employeeId: number | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  
  const authOperations = useAuthOperations();

  // Initialize auth state and set up listener
  useEffect(() => {
    const setupAuthStateListener = async () => {
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event, currentSession?.user?.id);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const profileData = await fetchUserProfile(currentSession.user.id);
            console.log('Profile data fetched:', profileData);
            if (profileData) {
              setIsAdmin(profileData.role === 'admin');
              setCustomerId(profileData.customer_id);
              setEmployeeId(profileData.employee_id);
            }
          } else {
            const defaultState = resetUserState();
            setIsAdmin(defaultState.isAdmin);
            setCustomerId(defaultState.customerId);
            setEmployeeId(defaultState.employeeId);
          }
          
          setLoading(false);
        }
      );
      
      // Check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const profileData = await fetchUserProfile(currentSession.user.id);
        if (profileData) {
          setIsAdmin(profileData.role === 'admin');
          setCustomerId(profileData.customer_id);
          setEmployeeId(profileData.employee_id);
        }
      }
      
      setLoading(false);
      
      return subscription;
    };
    
    // Set up auth listener and check for existing session
    const setupPromise = setupAuthStateListener();
    
    // Cleanup function
    return () => {
      setupPromise.then(subscription => subscription.unsubscribe());
    };
  }, []);

  // Build context value
  const value = {
    user,
    session,
    loading,
    isAdmin,
    customerId,
    employeeId,
    isLoading: authOperations.isLoading,
    ...authOperations
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
