
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  customerData: { customerid: number; name: string; email: string } | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, additionalData?: any) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  customerData: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState<{ customerid: number; name: string; email: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          setUser(sessionData.session.user);
          
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profileData?.customer_id) {
            // Fetch customer data
            const { data: customerData, error: customerError } = await supabase
              .from('customer')
              .select('customerid, name, email')
              .eq('customerid', profileData.customer_id)
              .single();
            
            if (customerError) throw customerError;
            setCustomerData(customerData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (session?.user) {
        setUser(session.user);
        
        try {
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profileData?.customer_id) {
            // Fetch customer data
            const { data: customerData, error: customerError } = await supabase
              .from('customer')
              .select('customerid, name, email')
              .eq('customerid', profileData.customer_id)
              .single();
            
            if (customerError) throw customerError;
            setCustomerData(customerData);
          }
        } catch (error) {
          console.error('Error fetching user data after auth state change:', error);
        }
      } else {
        setUser(null);
        setCustomerData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, additionalData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for verification.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCustomerData(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, customerData, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
