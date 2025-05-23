
import { supabase } from '@/integrations/supabase/client';
import { Employee, EmployeeDB } from '@/types/employee';
import { mapEmployeeDBToEmployee, mapEmployeeToDBFormat } from '@/utils/employeeMappers';

export type { Employee };

export const getEmployees = async (customerId?: string): Promise<Employee[]> => {
  try {
    let query = supabase
      .from('employee')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('firstname');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return (data || []).map(emp => mapEmployeeDBToEmployee(emp as EmployeeDB)) as Employee[];
  } catch (error) {
    console.error('Error in getEmployees:', error);
    throw error;
  }
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select('*')
      .eq('employeeid', id)
      .single();

    if (error) {
      console.error('Error fetching employee by ID:', error);
      throw error;
    }

    return data ? mapEmployeeDBToEmployee(data as EmployeeDB) : null;
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    throw error;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'employeeid'> & { customerid: string }): Promise<Employee> => {
  try {
    // Ensure customerid is present
    if (!employee.customerid) {
      throw new Error('Customer ID is required');
    }
    
    // Convert the employee data to DB format
    const dbEmployee = mapEmployeeToDBFormat(employee);
    
    // Create a properly typed object for insertion
    const employeeToInsert = {
      customerid: employee.customerid,
      ...dbEmployee
    } as const;
    
    console.log('About to insert employee data:', employeeToInsert);
    
    const { data, error } = await supabase
      .from('employee')
      .insert(employeeToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating employee:', error);
      throw error;
    }

    return mapEmployeeDBToEmployee(data as EmployeeDB);
  } catch (error) {
    console.error('Error in createEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  try {
    // Convert the updates to DB format
    const dbUpdates = mapEmployeeToDBFormat(updates);
    
    const { data, error } = await supabase
      .from('employee')
      .update(dbUpdates)
      .eq('employeeid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      throw error;
    }

    return mapEmployeeDBToEmployee(data as EmployeeDB);
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
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

// Export addEmployee as an alias for createEmployee
export const addEmployee = createEmployee;
