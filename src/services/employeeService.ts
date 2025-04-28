
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { mapEmployeeDBToEmployee, mapEmployeeToDBFormat } from '@/utils/employeeMappers';

export const getEmployees = async (customerId?: number): Promise<Employee[]> => {
  try {
    let query = supabase.from('employee').select();
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('employeeid');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return (data || []).map(mapEmployeeDBToEmployee);
  } catch (error) {
    console.error('Error in getEmployees:', error);
    throw error;
  }
};

export const getEmployeeById = async (id: number): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select()
      .eq('employeeid', id)
      .single();

    if (error) {
      console.error('Error fetching employee by ID:', error);
      throw error;
    }

    return data ? mapEmployeeDBToEmployee(data) : null;
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    throw error;
  }
};

export const addEmployee = async (employee: Omit<Employee, 'employeeid'>): Promise<Employee> => {
  try {
    console.log('Adding employee with data:', employee);
    
    if (!employee.firstname || !employee.lastname || !employee.email) {
      throw new Error('Employee must have firstname, lastname, and email');
    }
    
    const dbEmployee = mapEmployeeToDBFormat(employee);
    
    if (!dbEmployee.customerid) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: customerData } = await supabase
          .from('customer')
          .select('customerid')
          .eq('customerid', userData.user.id)
          .single();

        if (customerData?.customerid) {
          dbEmployee.customerid = customerData.customerid;
        }
      }
    }
    
    console.log('Submitting formatted employee data to database:', dbEmployee);
    
    const { data, error } = await supabase
      .from('employee')
      .insert(dbEmployee)
      .select()
      .single();

    if (error) {
      console.error('Error adding employee:', error);
      throw error;
    }

    return mapEmployeeDBToEmployee(data);
  } catch (error) {
    console.error('Error in addEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: number, employee: Omit<Partial<Employee>, 'employeeid'>): Promise<Employee> => {
  try {
    const dbEmployee = mapEmployeeToDBFormat(employee);
    
    console.log('Updating employee with sanitized data:', dbEmployee);
    
    const { data, error } = await supabase
      .from('employee')
      .update(dbEmployee)
      .eq('employeeid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      throw error;
    }

    return mapEmployeeDBToEmployee(data);
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('employee')
      .delete()
      .eq('employeeid', id);

    if (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    throw error;
  }
};

export type { Employee } from '@/types/employee';
