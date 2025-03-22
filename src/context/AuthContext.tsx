
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
        return;
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
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (!email || !password || !userData.name || !userData.companyName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting sign up for:", email, "with data:", userData);
      
      const nameParts = userData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create the user in Supabase Auth - FIXED: Use app_metadata instead of data
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {}, // Keep user_metadata empty
          meta: {  // Use app_metadata instead
            role: 'admin',
            company_name: userData.companyName,
            company_size: userData.companySize,
            phone_number: userData.phoneNumber
          }
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      console.log("Sign up response:", data);
      
      // Check if user was created successfully
      if (data.user) {
        console.log("User created successfully with ID:", data.user.id);
        
        // Manually create a profile since the trigger might be failing
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            role: 'admin'
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        } else {
          console.log("Profile created successfully");
        }
        
        // Create customer record manually since the trigger might be failing
        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .insert({
            name: userData.companyName,
            email: email,
            planid: 1, // Using default plan ID
            companysize: userData.companySize,
            phonenumber: userData.phoneNumber
          })
          .select();
          
        if (customerError) {
          console.error("Error creating customer:", customerError);
        } else if (customerData && customerData.length > 0) {
          console.log("Customer created successfully:", customerData[0]);
          
          // Update profile with customer_id
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ customer_id: customerData[0].customerid })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Error updating profile with customer ID:", updateError);
          } else {
            console.log("Profile updated with customer ID");
          }
        }
        
        toast({
          title: "Sign up successful",
          description: "Your account has been created.",
        });
        
        // If we have a session, the user was auto-confirmed
        if (data.session) {
          console.log("Session created with sign up, navigating to home");
          navigate("/");
        } else {
          // User might need to confirm their email
          toast({
            title: "Email verification",
            description: "Please check your email to verify your account before logging in.",
          });
          // Automatically switch to login tab
          navigate("/login");
        }
      } else {
        throw new Error("Failed to create user account");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        isLoading: loading,
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
