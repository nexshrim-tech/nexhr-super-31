
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Customer {
  customerid: string;
  customerauthid: string;
  name: string | null;
  email: string | null;
  phonenumber: string | null;
  companysize: string | null;
  planid: number | null;
}

export interface Profile {
  id: string;
  role: 'customer' | 'employee';
  full_name: string | null;
  email: string | null;
  customer_id: string | null;
  created_at: string;
}

export const getCurrentCustomer = async (user: User): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .eq('customerauthid', user.id)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in getCurrentCustomer:', error);
    return null;
  }
};

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const createCustomer = async (customerData: {
  customerid: string;
  name: string;
  email: string;
  phonenumber?: string;
  companysize?: string;
}): Promise<Customer | null> => {
  try {
    // Set the customerauthid to the same value as customerid to satisfy the foreign key constraint
    const { data, error } = await supabase
      .from('customer')
      .insert([
        {
          customerid: customerData.customerid, 
          customerauthid: customerData.customerid, // Also set the customerauthid field
          name: customerData.name,
          email: customerData.email,
          phonenumber: customerData.phonenumber || '',
          companysize: customerData.companysize || '',
          planid: 1 // Default free plan
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return null;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in createCustomer:', error);
    return null;
  }
};

export const updateCustomer = async (
  customerId: string,
  updates: Partial<Omit<Customer, 'customerid' | 'customerauthid'>>
): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .update(updates)
      .eq('customerid', customerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      return null;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    return null;
  }
};

// Map subscription plan IDs to names
const planNameMap: Record<number, string> = {
  1: "None",
  2: "Starter",
  3: "Professional",
  4: "Business",
  5: "Enterprise"
};

// Get the subscription plan name by customer ID
export const getSubscriptionPlan = async (customerId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('planid')
      .eq('customerid', customerId)
      .single();

    if (error) {
      console.error('Error fetching subscription plan:', error);
      return "None"; // Default to "None" if there's an error
    }

    const planId = data?.planid || 1;
    return planNameMap[planId] || "None";
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    return "None"; // Default to "None" if there's an exception
  }
};

// Update the subscription plan for a customer
export const updateSubscriptionPlan = async (customerId: string, planName: string): Promise<boolean> => {
  try {
    // Find the plan ID that corresponds to the plan name
    const planEntries = Object.entries(planNameMap);
    const planEntry = planEntries.find(([_, name]) => name === planName);
    
    if (!planEntry) {
      console.error('Invalid plan name:', planName);
      return false;
    }
    
    const planId = parseInt(planEntry[0], 10);
    
    const { error } = await supabase
      .from('customer')
      .update({ planid: planId })
      .eq('customerid', customerId);

    if (error) {
      console.error('Error updating subscription plan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateSubscriptionPlan:', error);
    return false;
  }
};

// Get the user role
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_role');

    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
};

// Check if user is a customer
export const isCustomer = async (): Promise<boolean> => {
  const role = await getUserRole(supabase.auth.getUser().then(user => user.data.user?.id || ''));
  return role === 'customer';
};

// Check if user is an employee
export const isEmployee = async (): Promise<boolean> => {
  const role = await getUserRole(supabase.auth.getUser().then(user => user.data.user?.id || ''));
  return role === 'employee';
};
