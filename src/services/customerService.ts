
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Customer {
  customerid: number;
  name: string;
  email: string;
  phonenumber?: string;
  companysize?: string;
  planid?: number;
}

export const getCurrentCustomer = async (user: User): Promise<Customer | null> => {
  try {
    // First get the profile to get the customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    if (!profile || !profile.customer_id) {
      console.log('No customer ID found for this user');
      return null;
    }

    // Now get the customer data
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .eq('customerid', profile.customer_id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentCustomer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .update(customer)
      .eq('customerid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    throw error;
  }
};

export const getSubscriptionPlan = async (customerId: number): Promise<string> => {
  try {
    // First get the planid from the customer
    const { data: customer, error: customerError } = await supabase
      .from('customer')
      .select('planid')
      .eq('customerid', customerId)
      .single();

    if (customerError) {
      console.error('Error fetching customer plan ID:', customerError);
      throw customerError;
    }

    if (!customer.planid) {
      return 'None';
    }

    // Now get the plan name
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('planname')
      .eq('planid', customer.planid)
      .single();

    if (planError) {
      console.error('Error fetching plan:', planError);
      throw planError;
    }

    return plan.planname || 'None';
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    return 'None';
  }
};

export const updateSubscriptionPlan = async (customerId: number, planName: string): Promise<void> => {
  try {
    // First get the planid from the plan name
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('planid')
      .eq('planname', planName)
      .single();

    if (planError) {
      console.error('Error fetching plan ID:', planError);
      throw planError;
    }

    // Now update the customer's planid
    const { error: updateError } = await supabase
      .from('customer')
      .update({ planid: plan.planid })
      .eq('customerid', customerId);

    if (updateError) {
      console.error('Error updating customer plan:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('Error in updateSubscriptionPlan:', error);
    throw error;
  }
};
