
import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    advancedAnalytics: ["Business", "Enterprise"].includes(plan),
  };
  
  // Save plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("subscription-plan", plan);
    
    // If user just registered and has no plan, show the subscription modal
    if (plan === "None") {
      // Only show it once after a delay on first load
      const timer = setTimeout(() => {
        setShowSubscriptionModal(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [plan]);
  
  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        setPlan,
        isSubscribed,
        showSubscriptionModal,
        setShowSubscriptionModal,
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
