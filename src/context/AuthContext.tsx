import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define our user role type to match the database enum
export type UserRole = 'admin' | 'customer' | 'employee';

// Define our profile type - updated to remove customer_id
export interface UserProfile {
  id: string;
  full_name: string | null;
  role: UserRole;
  employee_id?: string;
  customerauthid?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isEmployee: boolean;
  customerId?: string;
  employeeId?: string;
  customerAuthId?: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to fetch user profile using RPC function
  const fetchUserProfile = async (userId: string) => {
    try {
      // Use RPC function call to get profile data safely
      const { data, error } = await supabase.rpc('get_user_profile', { user_id: userId });

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      // Handle the response properly - the RPC function returns a single row
      if (data && Array.isArray(data) && data.length > 0) {
        return data[0] as UserProfile;
      } else if (data && !Array.isArray(data)) {
        return data as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  // Helper function to get customerid from customer table using customerauthid
  const fetchCustomerId = async (customerAuthId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer')
        .select('customerid')
        .eq('customerauthid', customerAuthId)
        .single();

      if (error) {
        console.error('Error fetching customer ID:', error);
        return undefined;
      }

      return data?.customerid;
    } catch (error) {
      console.error('Exception fetching customer ID:', error);
      return undefined;
    }
  };

  // Refresh the user profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
      
      // If user has customerauthid, fetch the actual customerid
      if (userProfile?.customerauthid) {
        const custId = await fetchCustomerId(userProfile.customerauthid);
        setCustomerId(custId);
      } else {
        setCustomerId(undefined);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        setIsLoading(true);

        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_IN' && session?.user) {
              console.log("User signed in:", session.user.email);
              
              // Fetch user profile with setTimeout to avoid potential deadlocks
              setTimeout(async () => {
                const userProfile = await fetchUserProfile(session.user.id);
                setProfile(userProfile);
                
                // If user has customerauthid, fetch the actual customerid
                if (userProfile?.customerauthid) {
                  const custId = await fetchCustomerId(userProfile.customerauthid);
                  setCustomerId(custId);
                } else {
                  setCustomerId(undefined);
                }
                
                toast({
                  title: "Signed in successfully",
                  description: `Welcome back, ${userProfile?.full_name || session.user.email}!`,
                });
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              setProfile(null);
              setCustomerId(undefined);
              
              toast({
                title: "Signed out successfully",
                description: "You have been signed out.",
              });
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
          
          // If user has customerauthid, fetch the actual customerid
          if (userProfile?.customerauthid) {
            const custId = await fetchCustomerId(userProfile.customerauthid);
            setCustomerId(custId);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, [toast]);

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
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: metadata.role || 'employee',
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
      setProfile(null);
      setCustomerId(undefined);
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

  // Role-based helper properties - updated to use resolved customerId
  const isAdmin = profile?.role === 'admin';
  const isCustomer = profile?.role === 'customer';
  const isEmployee = profile?.role === 'employee';
  const employeeId = profile?.employee_id;
  const customerAuthId = profile?.customerauthid;

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    isCustomer,
    isEmployee,
    customerId, // This now comes from the resolved customer table lookup
    employeeId,
    customerAuthId,
    signIn,
    signUp,
    signOut,
    refreshProfile
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
