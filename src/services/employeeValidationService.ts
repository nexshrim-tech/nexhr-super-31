
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
