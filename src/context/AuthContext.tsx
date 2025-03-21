
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isLoading: boolean; // Added for compatibility with existing code
  employeeId: number | null; // Added for compatibility with existing code
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          // Fetch employee ID when signed in
          fetchEmployeeId(currentSession?.user?.id);
          console.log("User signed in:", currentSession?.user?.id);
        } else if (event === 'SIGNED_OUT') {
          setEmployeeId(null);
          console.log("User signed out");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Existing session check:", currentSession ? "Found" : "None");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("Found existing user session:", currentSession.user.id);
        // Fetch employee ID for existing session
        fetchEmployeeId(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchEmployeeId = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      console.log("Fetching employee ID for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('employee_id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching employee ID:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      if (data && data.employee_id) {
        setEmployeeId(data.employee_id);
        console.log("Set employee ID:", data.employee_id);
      }
    } catch (error) {
      console.error('Error fetching employee ID:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      // Fetch user associations after login
      if (data.user) {
        await fetchUserAssociations(data.user.id);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to NexHR!",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      console.log("Attempting sign up for:", email, "with data:", userData);
      
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.name?.split(' ')[0] || '',
            last_name: userData.name?.split(' ').slice(1).join(' ') || '',
            role: 'admin',
            company_name: userData.companyName,
            phone_number: userData.phoneNumber,
            company_size: userData.companySize
          }
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      console.log("Sign up response:", data);
      
      // Set default subscription as None
      localStorage.setItem("subscription-plan", "None");
      localStorage.setItem("new-user", "true");
      
      // Check if user was created correctly
      if (data.user) {
        console.log("User created successfully with ID:", data.user.id);
        
        // If we have a session, the user was created successfully and we can redirect
        if (data.session) {
          console.log("Session created with sign up, navigating to home");
          setSession(data.session);
          setUser(data.user);
          
          toast({
            title: "Sign up successful",
            description: "Welcome to NexHR!",
          });
          
          navigate("/");
        } else {
          console.log("No session with sign up, email confirmation may be required");
          toast({
            title: "Sign up successful",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        console.error("Sign up appeared to succeed but no user was created");
        toast({
          title: "Sign up issue",
          description: "Account created but there was an issue. Please try logging in.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "Please fill in all required fields",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAssociations = async (userId: string) => {
    try {
      console.log("Fetching user associations for:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('employee_id, customer_id, role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user associations:", error);
        throw error;
      }
      
      console.log("User associations:", data);
      if (data) {
        if (data.employee_id) {
          setEmployeeId(data.employee_id);
        }
        
        // Handle any additional profile data that's needed
      }
    } catch (error) {
      console.error('Error fetching user associations:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setEmployeeId(null);
      navigate("/login");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        isLoading: loading, // Alias for compatibility
        employeeId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
