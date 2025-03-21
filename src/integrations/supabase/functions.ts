
import { supabase } from "@/integrations/supabase/client";

export const createProfile = async (userId: string, role: string = 'employee') => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: role
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const createCustomer = async (
  companyName: string, 
  email: string, 
  companySize: string,
  phoneNumber: string,
  planId: number = 1
) => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .insert({
        name: companyName,
        email: email,
        planid: planId,
        companysize: companySize,
        phonenumber: phoneNumber
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateProfileWithCustomerId = async (userId: string, customerId: number) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ customer_id: customerId })
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile with customer ID:', error);
    throw error;
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
