
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Initialize auth state and set up listener
  useEffect(() => {
    const setupAuthStateListener = () => {
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id);
          } else {
            resetUserState();
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
        await fetchUserProfile(currentSession.user.id);
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

  // Reset user state when logged out
  const resetUserState = () => {
    setIsAdmin(false);
    setCustomerId(null);
    setEmployeeId(null);
  };

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setIsAdmin(data.role === 'admin');
        setCustomerId(data.customer_id);
        setEmployeeId(data.employee_id);
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };
      
      // User is automatically set by the onAuthStateChange listener
      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting signup with data:', userData);
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userData.role || 'employee',
            name: userData.name || '',
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { error: authError, data: null };
      }
      
      console.log('Auth signup successful:', authData);
      
      // Handle admin user customer creation
      if (userData.role === 'admin' && authData.user) {
        const result = await createCustomerForAdmin(authData.user.id, userData, email);
        if (result.error) {
          return { error: result.error, data: authData };
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error, data: null };
    }
  };

  // Create customer record for admin users
  const createCustomerForAdmin = async (userId: string, userData: any, email: string) => {
    try {
      console.log('Creating customer record for admin user');
      
      // Insert the customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customer')
        .insert({
          name: userData.companyName,
          email: email,
          phonenumber: userData.phoneNumber,
          companysize: userData.companySize
        })
        .select('customerid')
        .single();
      
      if (customerError) {
        console.error('Customer creation error:', customerError);
        return { error: customerError };
      }
      
      console.log('Customer created with ID:', customerData?.customerid);
      
      // Update profile with customer ID
      if (customerData?.customerid) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ customer_id: customerData.customerid })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating profile with customer ID:', updateError);
          return { error: updateError };
        }
        
        console.log('Profile updated with customer ID:', customerData.customerid);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error in customer creation process:', error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

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
