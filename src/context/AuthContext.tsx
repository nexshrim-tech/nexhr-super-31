
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role?: string;
  customer_id?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on component mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }
        
        if (session) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Profile fetch error:', profileError);
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: profileData?.role || 'employee',
            customer_id: profileData?.customer_id,
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Profile fetch error on auth change:', profileError);
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: profileData?.role || 'employee',
            customer_id: profileData?.customer_id,
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
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
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Create the user in auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userData.role || 'employee',
            company_name: userData.companyName,
            company_size: userData.companySize,
            phone_number: userData.phoneNumber
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      // If the user is an admin, create a new customer record
      if (userData.role === 'admin' && data.user) {
        try {
          const { data: customerData, error: customerError } = await supabase
            .from('customer')
            .insert({
              name: userData.companyName,
              email: email,
              planid: 1, // Default plan
              companysize: userData.companySize,
              phonenumber: userData.phoneNumber
            })
            .select();

          if (customerError) {
            console.error('Customer creation error:', customerError);
            toast({
              title: "Customer creation failed",
              description: customerError.message,
              variant: "destructive",
            });
            return { error: customerError, data: null };
          }

          if (customerData && customerData.length > 0) {
            // Link the user to the customer
            const { error: linkError } = await supabase.rpc(
              'update_profile_customer',
              { 
                user_id: data.user.id, 
                customer_id_param: customerData[0].customerid 
              }
            );

            if (linkError) {
              console.error('Error linking user to customer:', linkError);
              return { error: linkError, data: null };
            }
          }
        } catch (customerError: any) {
          console.error('Customer creation exception:', customerError);
          return { error: customerError, data: null };
        }
      }

      toast({
        title: "Signup successful",
        description: "Your account has been created. Please check your email for verification.",
      });
      
      return { error: null, data };
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
