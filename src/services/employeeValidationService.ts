
import { supabase } from '@/integrations/supabase/client';

export const checkEmployeeIdExists = async (customerId: string, employeeId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_employee_id_exists', {
      p_customer_id: customerId,
      p_employee_id: employeeId
    });

    if (error) {
      console.error('Error checking employee ID:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Exception checking employee ID:', error);
    return false;
  }
};

export const registerEmployeeAuth = async (email: string, password: string, employeeId: string): Promise<string | null> => {
  try {
    console.log('Registering employee auth with:', { email, employeeId });
    
    // Call the register_employee function with proper UUID conversion
    const { data, error } = await supabase.rpc('register_employee', {
      p_email: email,
      p_password: password,
      p_employee_id: employeeId // Pass as string, the function will handle UUID conversion
    });
    
    if (error) {
      console.error('Error registering employee:', error);
      throw new Error(`Failed to register employee: ${error.message}`);
    }
    
    console.log('Employee auth registration successful:', data);
    return data;
  } catch (error) {
    console.error('Exception in registerEmployeeAuth:', error);
    throw error;
  }
};
