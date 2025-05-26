
import { supabase } from '@/integrations/supabase/client';

export const checkEmployeeIdExists = async (customerId: string, employeeId: string): Promise<boolean> => {
  try {
    console.log('Checking employee ID existence:', { customerId, employeeId });
    
    // Ensure both parameters are valid
    if (!customerId || !employeeId) {
      console.log('Missing parameters:', { customerId, employeeId });
      return false;
    }

    const { data, error } = await supabase.rpc('check_employee_id_exists', {
      p_customer_id: customerId,
      p_employee_id: employeeId
    });

    if (error) {
      console.error('Error checking employee ID:', error);
      return false;
    }

    console.log('Employee ID check result:', { employeeId, exists: data });
    return data || false;
  } catch (error) {
    console.error('Exception checking employee ID:', error);
    return false;
  }
};

export const registerEmployeeAuth = async (email: string, password: string, employeeId: string): Promise<string | null> => {
  try {
    console.log('Registering employee auth with:', { email, employeeId });
    
    if (!email || !password || !employeeId) {
      throw new Error('Missing required parameters for employee registration');
    }
    
    // Call the register_employee function - it now properly handles string to UUID conversion
    const { data, error } = await supabase.rpc('register_employee', {
      p_email: email,
      p_password: password,
      p_employee_id: employeeId // Pass as string, the function handles UUID conversion
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
