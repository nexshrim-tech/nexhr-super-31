
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Customer {
  customerid: number;
  name: string;
  address?: string;
  contactemail?: string;
  contactperson?: string;
  accountcreationdate?: string;
  subscriptionplan?: string;
  subscriptionstatus?: string;
  subscriptionenddate?: string;
}

export const getCurrentCustomer = async (user: User | null): Promise<Customer | null> => {
  if (!user) return null;
  
  try {
    // Get user profile to find customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('customerid')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile?.customerid) {
      console.error('Error fetching profile or no customer ID found:', profileError);
      return null;
    }
    
    // Get customer data
    const { data: customer, error: customerError } = await supabase
      .from('customer')
      .select('*')
      .eq('customerid', profile.customerid)
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
      .update({ customerid: customerId })
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
    const { data, error } = await supabase
      .from('customer')
      .select('subscriptionplan')
      .eq('customerid', customerId)
      .single();
    
    if (error) {
      console.error('Error fetching subscription plan:', error);
      throw error;
    }
    
    return data?.subscriptionplan || null;
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    return null;
  }
};

export const updateSubscriptionPlan = async (customerId: number, plan: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customer')
      .update({ 
        subscriptionplan: plan,
        subscriptionstatus: plan === "None" ? "Inactive" : "Active",
        subscriptionenddate: plan === "None" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
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
