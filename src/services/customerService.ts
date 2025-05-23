
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  customerid: string;
  customerauthid: string;
  name: string;
  email: string;
  password?: string;
  planid: number;
  companysize: string;
  phonenumber: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

    return (data || []).map(item => ({
      customerid: item.customerid,
      customerauthid: item.customerauthid,
      name: item.name || '',
      email: item.email || '',
      planid: item.planid || 1,
      companysize: item.companysize || '',
      phonenumber: item.phonenumber || ''
    })) as Customer[];
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .eq('customerid', id)
      .single();

    if (error) {
      console.error('Error fetching customer by ID:', error);
      throw error;
    }

    return {
      customerid: data.customerid,
      customerauthid: data.customerauthid,
      name: data.name || '',
      email: data.email || '',
      planid: data.planid || 1,
      companysize: data.companysize || '',
      phonenumber: data.phonenumber || ''
    } as Customer;
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    throw error;
  }
};

export const getCurrentCustomer = async (): Promise<Customer | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .eq('customerauthid', user.id)
      .single();

    if (error) {
      console.error('Error fetching current customer:', error);
      return null;
    }

    return {
      customerid: data.customerid,
      customerauthid: data.customerauthid,
      name: data.name || '',
      email: data.email || '',
      planid: data.planid || 1,
      companysize: data.companysize || '',
      phonenumber: data.phonenumber || ''
    } as Customer;
  } catch (error) {
    console.error('Error in getCurrentCustomer:', error);
    return null;
  }
};

export const getSubscriptionPlan = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('planid, plans:planid(planname, price, featurelist)')
      .eq('customerid', customerId)
      .single();

    if (error) {
      console.error('Error fetching subscription plan:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    throw error;
  }
};

export const updateSubscriptionPlan = async (customerId: string, planId: number) => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .update({ planid: planId })
      .eq('customerid', customerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription plan:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSubscriptionPlan:', error);
    throw error;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'customerid'>): Promise<Customer> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .insert(customer)
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      throw error;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in createCustomer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .update(updates)
      .eq('customerid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      throw error;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customer')
      .delete()
      .eq('customerid', id);

    if (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    throw error;
  }
};
