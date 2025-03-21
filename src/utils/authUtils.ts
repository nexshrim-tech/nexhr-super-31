
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
