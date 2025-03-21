
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

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        } else {
          setIsAdmin(false);
          setCustomerId(null);
          setEmployeeId(null);
        }
        
        setLoading(false);
      }
    );

    // Then fetch the current session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      
      // Now if user is admin, create customer record after auth user is created
      if (userData.role === 'admin' && authData.user) {
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
            return { error: customerError, data: authData };
          }
          
          console.log('Customer created with ID:', customerData?.customerid);
          
          // Now update the user's profile with the customer ID
          if (customerData?.customerid) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ customer_id: customerData.customerid })
              .eq('id', authData.user.id);
              
            if (updateError) {
              console.error('Error updating profile with customer ID:', updateError);
            } else {
              console.log('Profile updated with customer ID:', customerData.customerid);
            }
          }
        } catch (error: any) {
          console.error('Error in customer creation process:', error);
          return { error, data: authData };
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

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
