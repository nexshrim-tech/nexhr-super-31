
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
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
        setIsLoading(false);
        return { error };
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: "Error during login",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return { error };
    }
  };

  // Sign up new user - now works without email verification
  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      console.log('Starting signup with data:', userData);
      
      // Create the auth user without email verification requirements
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            role: userData.isAdmin ? 'admin' : 'employee',
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
        setIsLoading(false);
        return { error: authError, data: null };
      }
      
      console.log('Auth signup successful:', authData);
      
      // If user is admin, create a customer record
      if (userData.isAdmin && authData.user) {
        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .insert({
            name: userData.companyName,
            email: email,
            phonenumber: userData.phoneNumber || '',
            companysize: userData.companySize || ''
          })
          .select('customerid')
          .single();
          
        if (customerError) {
          console.error('Customer creation error:', customerError);
          toast({
            title: "Customer creation failed",
            description: "Your account was created but customer setup failed",
            variant: "destructive",
          });
          setIsLoading(false);
          return { error: customerError, data: authData };
        }
        
        if (customerData) {
          // Update profile with customer ID
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ customer_id: customerData.customerid })
            .eq('id', authData.user.id);
            
          if (profileError) {
            console.error('Profile update error:', profileError);
            toast({
              title: "Profile update failed",
              description: "Customer record created but profile update failed",
              variant: "destructive",
            });
          }
        }
      }

      toast({
        title: "Signup successful",
        description: "Your account has been created",
      });
      
      // Since verification is disabled, we can immediately navigate to the dashboard
      navigate('/');
      setIsLoading(false);
      return { data: authData, error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      toast({
        title: "Signup error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading
  };
};
