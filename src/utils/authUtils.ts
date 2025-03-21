
import { supabase } from '@/integrations/supabase/client';

// Reset user state when logged out
export const resetUserState = () => {
  return {
    isAdmin: false,
    customerId: null,
    employeeId: null
  };
};

// Fetch user profile data from Supabase
export const fetchUserProfile = async (userId: string) => {
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

    return data;
  } catch (error) {
    console.error('Error in profile fetch:', error);
    return null;
  }
};

// Create customer record for admin users during signup
export const createCustomerForAdmin = async (userId: string, userData: any, email: string) => {
  try {
    console.log('Creating customer record for admin user');
    
    // Insert the customer record
    const { data: customerData, error: customerError } = await supabase
      .from('customer')
      .insert({
        name: userData.companyName,
        email: email,
        phonenumber: userData.phoneNumber,
        companysize: userData.companySize
      })
      .select('customerid')
      .single();
    
    if (customerError) {
      console.error('Customer creation error:', customerError);
      return { error: customerError };
    }
    
    console.log('Customer created with ID:', customerData?.customerid);
    
    // Update profile with customer ID directly
    if (customerData?.customerid) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ customer_id: customerData.customerid })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile with customer ID:', updateError);
        return { error: updateError };
      }
      
      console.log('Profile updated with customer ID:', customerData.customerid);
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in customer creation process:', error);
    return { error };
  }
};
