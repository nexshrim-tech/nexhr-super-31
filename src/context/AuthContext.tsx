
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define our user role type to match the database enum
export type UserRole = 'admin' | 'customer' | 'employee';

// Define our profile type
export interface UserProfile {
  id: string;
  full_name: string | null;
  role: UserRole;
  customer_id?: string;
  employee_id?: string;
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
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  // Refresh the user profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
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
                
                toast({
                  title: "Signed in successfully",
                  description: `Welcome back, ${userProfile?.full_name || session.user.email}!`,
                });
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              setProfile(null);
              
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

  // Role-based helper properties
  const isAdmin = profile?.role === 'admin';
  const isCustomer = profile?.role === 'customer';
  const isEmployee = profile?.role === 'employee';
  const customerId = profile?.customer_id;
  const employeeId = profile?.employee_id;

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    isCustomer,
    isEmployee,
    customerId,
    employeeId,
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
