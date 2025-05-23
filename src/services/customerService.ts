
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Customer {
  customerid: string;  // Changed from number to string since it's now a UUID
  name: string | null;
  address?: string;
  contactemail?: string;
  contactperson?: string;
  accountcreationdate?: string;
  subscriptionplan?: string | null;
  subscriptionstatus?: string;
  subscriptionenddate?: string;
  email: string | null;
  password: string | null;
  phonenumber: string | null;
  companysize: string | null;
  planid: number | null;
}

export const getCurrentCustomer = async (user: User | null): Promise<Customer | null> => {
  if (!user) return null;
  
  try {
    // Get customer data directly using auth.uid()
    const { data: customer, error } = await supabase
      .from('customer')
      .select('*')
      .eq('customerid', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
    
    return customer;
  } catch (error) {
    console.error('Error in getCurrentCustomer:', error);
    return null;
  }
};

export const createCustomer = async (data: Omit<Customer, 'customerid'>): Promise<Customer | null> => {
  try {
    const { data: customer, error } = await supabase
      .from('customer')
      .insert([data])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
    
    return customer;
  } catch (error) {
    console.error('Error in createCustomer:', error);
    throw error;
  }
};

export const getSubscriptionPlan = async (customerId: string): Promise<string | null> => {
  try {
    const { data } = await supabase
      .from('customer')
      .select('planid')
      .eq('customerid', customerId)
      .single();
    
    if (data && 'planid' in data) {
      const planId = data.planid;
      if (planId === 1) return "None";
      if (planId === 2) return "Basic";
      if (planId === 3) return "Premium";
      return String(planId);
    }
    
    return null;
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    return null;
  }
};

export const updateSubscriptionPlan = async (customerId: string, plan: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customer')
      .update({ 
        planid: plan === "None" ? 1 : plan === "Basic" ? 2 : 3
      })
      .eq('customerid', customerId);
    
    if (error) {
      console.error('Error updating subscription plan:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateSubscriptionPlan:', error);
    throw error;
  }
};
