
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createCustomerForAdmin } from '@/utils/authUtils';
import { useNavigate } from 'react-router-dom';

export const useAuthOperations = () => {
  const navigate = useNavigate();

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

  // Sign up new user with string role instead of enum
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting signup with data:', userData);
      
      // Create the auth user with string role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Store role as string
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

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
