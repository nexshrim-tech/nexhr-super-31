
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

export const getCurrentCustomer = async (user: User): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .eq('customerid', user.id)
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
