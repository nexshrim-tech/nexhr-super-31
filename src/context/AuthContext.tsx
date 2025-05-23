
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  getCurrentCustomer, 
  createCustomer, 
  getUserProfile, 
  getUserRole,
  Profile
} from '@/services/customerService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  customerId: string | null;
  userRole: string | null;
  userProfile: Profile | null;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  // Get user's customerid and role
  const fetchUserData = async (user: User) => {
    try {
      // Fetch user's profile (role information)
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
      
      if (profile) {
        setUserRole(profile.role);
        
        // If user is a customer, fetch customer ID
        if (profile.role === 'customer') {
          const customer = await getCurrentCustomer(user);
          if (customer) {
            console.log("Found customer record with ID:", customer.customerid);
            setCustomerId(customer.customerid);
          } else {
            console.log("No customer record found for user");
            setCustomerId(null);
          }
        } else if (profile.role === 'employee') {
          // For employees, set customer ID from profile
          setCustomerId(profile.customer_id);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setCustomerId(null);
      setUserRole(null);
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
          // Fetch the user data after sign in using setTimeout to avoid auth deadlock
          setTimeout(() => {
            fetchUserData(session.user!);
          }, 0);
          
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setCustomerId(null);
          setUserRole(null);
          setUserProfile(null);
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
        fetchUserData(session.user);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching initial session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      
      // Determine the role based on metadata
      const role = metadata.role || (metadata.company_name ? 'customer' : 'employee');
      console.log(`Determined role: ${role}`);
      
      // First, create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role,
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
      
      // Wait a moment to ensure auth user is fully created before proceeding
      if (data.user && role === 'customer') {
        try {
          // Check if a customer record already exists
          const existingCustomer = await getCurrentCustomer(data.user);
          
          // Only create customer if none exists
          if (!existingCustomer) {
            console.log("Creating new customer record");
            await createCustomer({
              // Important: Use auth.user.id as customerid to align with constraint
              customerid: data.user.id,
              name: metadata.company_name || metadata.full_name || '',
              email: email,
              phonenumber: metadata.phone_number || '',
              companysize: metadata.company_size || '',
            });
          } else {
            console.log("Customer record already exists:", existingCustomer.customerid);
          }
          
          setCustomerId(data.user.id);
        } catch (customerError) {
          console.error("Error creating customer record:", customerError);
          // We don't want to fail the signup if this fails
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
      setUserRole(null);
      setUserProfile(null);
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
    userRole,
    userProfile,
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
