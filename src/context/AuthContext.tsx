
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { resetUserState, fetchUserProfile } from '@/utils/authUtils';
import { useAuthOperations } from '@/hooks/useAuthOperations';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
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
  
  const { signIn, signUp, signOut } = useAuthOperations();

  // Initialize auth state and set up listener
  useEffect(() => {
    const setupAuthStateListener = () => {
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const profileData = await fetchUserProfile(currentSession.user.id);
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
      
      return subscription;
    };
    
    const checkExistingSession = async () => {
      // Then fetch the current session
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
    };
    
    // Set up auth listener and check for existing session
    const subscription = setupAuthStateListener();
    checkExistingSession();

    // Cleanup function
    return () => {
      subscription.unsubscribe();
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
    signIn,
    signUp,
    signOut,
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
