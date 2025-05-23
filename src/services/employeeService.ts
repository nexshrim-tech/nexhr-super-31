
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { mapEmployeeDBToEmployee, mapEmployeeToDBFormat } from '@/utils/employeeMappers';

export const getEmployees = async (customerId?: string): Promise<Employee[]> => {
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

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    // Handle special case for admin users
    if (!id || id === '0' || id === 'admin') {
      return {
        employeeid: '0',
        customerid: '',
        firstname: 'Admin',
        lastname: 'User',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalcode: '',
        jobtitle: '',
        department: '',
        employmentstatus: 'Active',
        gender: '',
      };
    }

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
    console.log('Formatted employee data for database:', dbEmployee);
    
    if (!dbEmployee.customerid) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: customerData } = await supabase
          .from('customer')
          .select('customerid')
          .eq('customerauthid', userData.user.id)
          .single();

        if (customerData?.customerid) {
          dbEmployee.customerid = customerData.customerid;
        }
      }
    }
    
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

export const updateEmployee = async (id: string, employee: Omit<Partial<Employee>, 'employeeid'>): Promise<Employee> => {
  try {
    console.log('Updating employee with data:', employee);
    
    const dbEmployee = mapEmployeeToDBFormat(employee);
    console.log('Formatted employee data for database update:', dbEmployee);
    
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
    
    console.log(`Employee with ID ${id} has been permanently deleted`);
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    throw error;
  }
};

export type { Employee } from '@/types/employee';
