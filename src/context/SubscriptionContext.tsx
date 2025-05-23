
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getSubscriptionPlan, updateSubscriptionPlan, getCurrentCustomer } from "../services/customerService";

export type SubscriptionPlan = "None" | "Starter" | "Professional" | "Business" | "Enterprise";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isSubscribed: boolean;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  customerId: string | null;
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
    maxEmployees: number;
  };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const getMaxEmployees = (plan: SubscriptionPlan): number => {
  switch (plan) {
    case "None": return 1;
    case "Starter": return 5;
    case "Professional": return 20;
    case "Business": return 50;
    case "Enterprise": return 999; // unlimited for practical purposes
    default: return 1;
  }
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, customerId: authCustomerId, userRole } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan>("None");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
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
    maxEmployees: getMaxEmployees(plan),
  };
  
  useEffect(() => {
    // Only fetch subscription data if the user is authenticated and is a customer
    // or if they're an employee (need to know what features they have access to)
    const fetchSubscription = async () => {
      if (user && (userRole === 'customer' || (userRole === 'employee' && authCustomerId))) {
        try {
          const effectiveCustomerId = userRole === 'customer' ? user.id : authCustomerId;
          
          if (effectiveCustomerId) {
            setCustomerId(effectiveCustomerId);
            const planName = await getSubscriptionPlan(effectiveCustomerId);
            setPlan(planName as SubscriptionPlan || "None");
            
            // Show subscription modal for new users with no plan - only for customers
            if (planName === "None" && userRole === 'customer') {
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
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        }
      }
    };
    
    fetchSubscription();
  }, [user, authCustomerId, userRole]);
  
  const handleSetPlan = async (newPlan: SubscriptionPlan) => {
    setPlan(newPlan);
    
    // Only customers can update subscription plans
    if (user && userRole === 'customer' && customerId) {
      try {
        await updateSubscriptionPlan(customerId, newPlan);
      } catch (error) {
        console.error("Error updating subscription plan:", error);
      }
    }
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        setPlan: handleSetPlan,
        isSubscribed,
        showSubscriptionModal,
        setShowSubscriptionModal,
        customerId,
        features,
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
