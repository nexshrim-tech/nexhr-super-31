
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getSubscriptionPlan, updateSubscriptionPlan, getCurrentCustomer } from "../services/customerService";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionPlan = "None" | "Starter" | "Professional" | "Business" | "Enterprise";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isSubscribed: boolean;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  customerId: number | null;
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
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan>("None");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
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
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        try {
          setIsLoading(true);
          
          // Get customer information from the user profile
          const customer = await getCurrentCustomer(user);
          if (customer) {
            setCustomerId(customer.customerid);
            
            // Get subscription plan from the database
            const planName = await getSubscriptionPlan(customer.customerid);
            const subscriptionPlan = planName as SubscriptionPlan || "None";
            setPlan(subscriptionPlan);
            
            console.log(`Loaded user subscription: ${subscriptionPlan}`);
            
            // Show subscription modal for new users with no plan
            if (subscriptionPlan === "None") {
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
          toast({
            title: "Error loading subscription",
            description: "There was an error loading your subscription. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchSubscription();
  }, [user, toast]);
  
  const handleSetPlan = async (newPlan: SubscriptionPlan) => {
    if (newPlan === plan) return; // Don't update if plan hasn't changed
    
    try {
      if (user && customerId) {
        // Update plan in database
        await updateSubscriptionPlan(customerId, newPlan);
        
        // Update local state
        setPlan(newPlan);
        
        // Show confirmation toast
        toast({
          title: `${newPlan} Plan Activated`,
          description: newPlan === "None" 
            ? "Your subscription has been cancelled." 
            : `You now have access to all ${newPlan} plan features.`,
          variant: "default",
        });
        
        console.log(`Updated subscription to: ${newPlan}`);
      } else {
        console.error("Cannot update subscription: User or customer ID is missing");
        toast({
          title: "Subscription Error",
          description: "Unable to update subscription. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      toast({
        title: "Subscription Error",
        description: "There was an error updating your subscription.",
        variant: "destructive",
      });
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
      {isLoading ? (
        // You could add a loading state here if desired
        children
      ) : (
        children
      )}
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
