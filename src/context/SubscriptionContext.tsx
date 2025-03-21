
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionPlan = "None" | "Starter" | "Professional" | "Business" | "Enterprise";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isSubscribed: boolean;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  features: {
    employeeManagement: boolean;
    attendanceTracking: boolean;
    leaveManagement: boolean;
    documentGeneration: boolean;
    salaryManagement: boolean;
    assetManagement: boolean;
    expenseManagement: boolean;
    helpDesk: boolean;
    projectManagement: boolean;
    advancedAnalytics: boolean;
  };
  employeeLimit: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plan, setPlan] = useState<SubscriptionPlan>(() => {
    const savedPlan = localStorage.getItem("subscription-plan");
    return (savedPlan as SubscriptionPlan) || "None";
  });
  
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const isSubscribed = plan !== "None";
  
  // Define which features are available for each plan
  const features = {
    employeeManagement: isSubscribed,
    attendanceTracking: isSubscribed,
    leaveManagement: isSubscribed,
    documentGeneration: ["Professional", "Business", "Enterprise"].includes(plan),
    salaryManagement: ["Professional", "Business", "Enterprise"].includes(plan),
    assetManagement: ["Professional", "Business", "Enterprise"].includes(plan),
    expenseManagement: ["Business", "Enterprise"].includes(plan),
    helpDesk: ["Business", "Enterprise"].includes(plan),
    projectManagement: ["Business", "Enterprise"].includes(plan),
    advancedAnalytics: ["Enterprise"].includes(plan),
  };
  
  // Define employee limits for each plan
  const employeeLimit = (() => {
    switch (plan) {
      case "Starter": return 10;
      case "Professional": return 30;
      case "Business": return 100;
      case "Enterprise": return 1000;
      default: return 0;
    }
  })();
  
  // Fetch plan from Supabase when user logs in
  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return;
      
      try {
        // Get customer ID for the current user
        const { data: customerId, error: customerIdError } = await supabase.rpc(
          'get_current_customer_id'
        );
        
        if (customerIdError) throw customerIdError;
        
        if (customerId) {
          // Get customer details including plan
          const { data: customerData, error: customerError } = await supabase
            .from('customer')
            .select('planid')
            .eq('customerid', customerId)
            .single();
          
          if (customerError) throw customerError;
          
          if (customerData?.planid) {
            // Get plan name from plan ID
            const { data: planData, error: planError } = await supabase
              .from('plans')
              .select('planname')
              .eq('planid', customerData.planid)
              .single();
            
            if (planError) throw planError;
            
            if (planData?.planname) {
              setPlan(planData.planname as SubscriptionPlan);
              localStorage.setItem("subscription-plan", planData.planname);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching subscription plan:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your subscription plan.",
          variant: "destructive",
        });
      }
    };
    
    fetchPlan();
  }, [user, toast]);
  
  // Save plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("subscription-plan", plan);
    
    // If user just subscribed, hide the subscription modal and show a success message
    if (plan !== "None") {
      setShowSubscriptionModal(false);
    }
    // Only show the subscription modal for new users with no plan
    else if (plan === "None" && user) {
      const isNewUser = localStorage.getItem("new-user") === "true";
      if (isNewUser) {
        // Show the modal after a delay on first load for new users
        const timer = setTimeout(() => {
          setShowSubscriptionModal(true);
          localStorage.removeItem("new-user");
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [plan, user]);
  
  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        setPlan,
        isSubscribed,
        showSubscriptionModal,
        setShowSubscriptionModal,
        features,
        employeeLimit
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
