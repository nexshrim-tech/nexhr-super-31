
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createCustomerForAdmin } from '@/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials",
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: "Error during login",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Sign up new user with string role
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
        toast({
          title: "Signup failed",
          description: authError.message || "Error during signup",
          variant: "destructive",
        });
        return { error: authError, data: null };
      }
      
      console.log('Auth signup successful:', authData);
      
      // Handle admin user customer creation
      if (userData.role === 'admin' && authData.user) {
        const result = await createCustomerForAdmin(authData.user.id, userData, email);
        if (result.error) {
          toast({
            title: "Customer creation failed",
            description: "Your account was created but customer setup failed",
            variant: "destructive", // Changed from "warning" to "destructive" to fix the type error
          });
          return { error: result.error, data: authData };
        }
      }

      toast({
        title: "Signup successful",
        description: "Your account has been created",
      });
      navigate('/');
      return { data: authData, error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      toast({
        title: "Signup error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
