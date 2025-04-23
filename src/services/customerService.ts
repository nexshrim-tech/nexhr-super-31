
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Customer {
  customerid: number;
  name: string;
  address?: string;
  contactemail?: string;
  contactperson?: string;
  accountcreationdate?: string;
  subscriptionplan?: string | null;
  subscriptionstatus?: string;
  subscriptionenddate?: string;
}

export const getCurrentCustomer = async (user: User | null): Promise<Customer | null> => {
  if (!user) return null;
  
  try {
    // Get user profile to find customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('customer_id')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile?.customer_id) {
      console.error('Error fetching profile or no customer ID found:', profileError);
      return null;
    }
    
    // Get customer data
    const { data: customer, error: customerError } = await supabase
      .from('customer')
      .select('*')
      .eq('customerid', profile.customer_id)
      .single();
    
    if (customerError) {
      console.error('Error fetching customer:', customerError);
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

export const updateCustomerProfile = async (userId: string, customerId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ customer_id: customerId })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile with customer ID:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateCustomerProfile:', error);
    throw error;
  }
};

export const getSubscriptionPlan = async (customerId: number): Promise<string | null> => {
  try {
    // Check if plan field exists in the table
    const { data } = await supabase
      .from('customer')
      .select('planid')
      .eq('customerid', customerId)
      .single();
    
    if (data && 'planid' in data) {
      // Map plan ID to plan name
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

export const updateSubscriptionPlan = async (customerId: number, plan: string): Promise<void> => {
  try {
    // Map plan name to plan ID
    const { error } = await supabase
      .from('customer')
      .update({ 
        // Only include fields that exist in the customer table
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
