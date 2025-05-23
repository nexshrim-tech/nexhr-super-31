
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define proper types for subscription plans
interface Plan {
  planname: string;
  price: number;
  featurelist: string;
}

interface SubscriptionPlan {
  planid: number;
  plan: Plan;
}

interface SubscriptionContextType {
  subscription: SubscriptionPlan | null;
  isLoading: boolean;
  error: Error | null;
  refreshSubscription: () => Promise<void>;
  updatePlan: (planId: number) => Promise<boolean>;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  plan: string;
  setPlan: (plan: string) => void;
  features: string[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [plan, setPlan] = useState<string>("None");
  const [features, setFeatures] = useState<string[]>([]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First get the current customer
      const { data: customerData, error: customerError } = await supabase.auth.getUser();
      
      if (customerError) throw customerError;
      
      if (!customerData.user) {
        setIsLoading(false);
        return;
      }

      // Get customer details from the database
      const { data: customer, error: customerDbError } = await supabase
        .from('customer')
        .select('planid')
        .eq('customerauthid', customerData.user.id)
        .single();
        
      if (customerDbError) throw customerDbError;
      
      if (!customer) {
        setIsLoading(false);
        return;
      }

      // Now get the plan details
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('planid', customer.planid)
        .single();
        
      if (planError) throw planError;
      
      if (planData) {
        // Convert to our expected SubscriptionPlan format
        const subscriptionData: SubscriptionPlan = {
          planid: planData.planid,
          plan: {
            planname: planData.planname,
            price: planData.price,
            featurelist: planData.featurelist
          }
        };
        
        setSubscription(subscriptionData);
        setPlan(planData.planname || "None");
        setFeatures(planData.featurelist ? planData.featurelist.split(',') : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (planId: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error('No authenticated user');
      
      // Update the customer's plan in the database
      const { error: updateError } = await supabase
        .from('customer')
        .update({ planid: planId })
        .eq('customerauthid', userData.user.id);
        
      if (updateError) throw updateError;
      
      await fetchSubscription(); // Refresh subscription data
      
      toast.success('Subscription plan updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating subscription:', err);
      toast.error('Failed to update subscription plan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refreshSubscription: fetchSubscription,
        updatePlan,
        showSubscriptionModal,
        setShowSubscriptionModal,
        plan,
        setPlan,
        features
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
