
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getCurrentCustomer, createCustomer } from '@/services/customerService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  customerId: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
}

interface UserMetadata {
  role: string;
  full_name: string;
  company_name?: string;
  company_size?: string;
  phone_number?: string;
  company_address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get user's customerid
  const fetchCustomerId = async (user: User) => {
    try {
      const customer = await getCurrentCustomer(user);
      if (customer) {
        console.log("Found customer record with ID:", customer.customerid);
        setCustomerId(customer.customerid);
      } else {
        console.log("No customer record found for user");
        setCustomerId(null);
      }
    } catch (error) {
      console.error("Error fetching customer ID:", error);
      setCustomerId(null);
    }
  };

  useEffect(() => {
    // First set up auth state listener to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("User signed in:", session.user.email);
          // Fetch the customer ID after sign in using setTimeout to avoid auth deadlock
          setTimeout(() => {
            fetchCustomerId(session.user!);
          }, 0);
          
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setCustomerId(null);
          toast({
            title: "Signed out successfully",
            description: "You have been signed out.",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchCustomerId(session.user);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching initial session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Make sure to include navigate in deps if it's used inside useEffect

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Signing up with metadata:', metadata);
      
      // First, create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: metadata.role || (metadata.company_name ? 'admin' : 'employee'),
            full_name: metadata.full_name || '',
            company_name: metadata.company_name,
            company_size: metadata.company_size,
            phone_number: metadata.phone_number,
            company_address: metadata.company_address
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Sign up successful:', data);
      
      // If there's no trigger, manually create a customer record as a fallback
      if (data.user) {
        try {
          const customerData = {
            customerid: data.user.id, // Use auth user id as customerid
            name: metadata.company_name || metadata.full_name || '',
            email: email,
            phonenumber: metadata.phone_number || '',
            companysize: metadata.company_size || '',
          };
          
          console.log("Creating customer record as fallback:", customerData);
          
          // Check if a customer record already exists
          const existingCustomer = await getCurrentCustomer(data.user);
          
          if (!existingCustomer) {
            // Only create if it doesn't exist
            await createCustomer(customerData);
          }
          
          setCustomerId(data.user.id);
        } catch (customerError) {
          console.error("Error creating customer record:", customerError);
          // We don't want to fail the signup if this fails
          // The trigger should handle this anyway
        }
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setCustomerId(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    customerId,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
