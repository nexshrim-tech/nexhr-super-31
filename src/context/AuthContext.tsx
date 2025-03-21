
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  customerId: number | null;
  employeeId: number | null;  // Added missing property
  isLoading: boolean;         // Added missing property
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
  const [employeeId, setEmployeeId] = useState<number | null>(null); // Added state for employeeId
  const [isLoading, setIsLoading] = useState(false); // Added state for isLoading
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true); // Set loading state when signing in
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
    } finally {
      setIsLoading(false); // Reset loading state after signing in completes
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true); // Set loading state when signing up
      console.log('Starting signup with data:', userData);
      
      // Create the auth user
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
    } finally {
      setIsLoading(false); // Reset loading state after signing up completes
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true); // Set loading state when signing out
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
      setIsLoading(false); // Reset loading state after signing out completes
    }
  };

  // Initialize auth state and set up listener
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, currentSession?.user?.id);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              // Fetch user profile data
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (!error && profileData) {
                setIsAdmin(profileData.role === 'admin');
                setCustomerId(profileData.customer_id);
                setEmployeeId(profileData.employee_id || null); // Set employeeId from profile data
              } else {
                setIsAdmin(false);
                setCustomerId(null);
                setEmployeeId(null);
              }
            } else {
              setIsAdmin(false);
              setCustomerId(null);
              setEmployeeId(null);
            }
            
            setLoading(false);
          }
        );
        
        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch user profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (!error && profileData) {
            setIsAdmin(profileData.role === 'admin');
            setCustomerId(profileData.customer_id);
            setEmployeeId(profileData.employee_id || null); // Set employeeId from profile data
          } else {
            setIsAdmin(false);
            setCustomerId(null);
            setEmployeeId(null);
          }
        }
        
        setLoading(false);
        
        return subscription;
      } catch (error) {
        console.error('Error setting up auth:', error);
        setLoading(false);
        return null;
      }
    };
    
    // Set up auth
    const subscriptionPromise = setupAuth();
    
    // Cleanup function
    return () => {
      subscriptionPromise.then(subscription => {
        if (subscription) subscription.unsubscribe();
      });
    };
  }, []);

  // Build context value
  const value = {
    user,
    session,
    loading,
    isAdmin,
    customerId,
    employeeId,      // Include employeeId in the context value
    isLoading,       // Include isLoading in the context value
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
