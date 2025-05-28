
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
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(employeeId)) {
      throw new Error('Invalid employee ID format - must be a valid UUID');
    }
    
    // Call the register_employee function
    const { data, error } = await supabase.rpc('register_employee', {
      p_email: email,
      p_password: password,
      p_employee_id: employeeId
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
