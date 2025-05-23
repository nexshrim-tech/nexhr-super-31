
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/customer';

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .order('customerid');

    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

    return (data || []).map(item => ({
      customerid: item.customerid,
      customerauthid: item.customerauthid,
      name: item.name || undefined,
      email: item.email || undefined,
      phonenumber: item.phonenumber || undefined,
      planid: item.planid || undefined,
      companysize: item.companysize || undefined
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
      name: data.name || undefined,
      email: data.email || undefined,
      phonenumber: data.phonenumber || undefined,
      planid: data.planid || undefined,
      companysize: data.companysize || undefined
    } as Customer;
  } catch (error) {
    console.error('Error in getCustomerById:', error);
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

    return {
      customerid: data.customerid,
      customerauthid: data.customerauthid,
      name: data.name || undefined,
      email: data.email || undefined,
      phonenumber: data.phonenumber || undefined,
      planid: data.planid || undefined,
      companysize: data.companysize || undefined
    } as Customer;
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

    return {
      customerid: data.customerid,
      customerauthid: data.customerauthid,
      name: data.name || undefined,
      email: data.email || undefined,
      phonenumber: data.phonenumber || undefined,
      planid: data.planid || undefined,
      companysize: data.companysize || undefined
    } as Customer;
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

export type { Customer };
