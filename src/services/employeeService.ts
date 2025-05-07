
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { mapEmployeeDBToEmployee, mapEmployeeToDBFormat } from '@/utils/employeeMappers';

export const getEmployees = async (customerId?: number): Promise<Employee[]> => {
  try {
    console.log('Fetching employees with auth user...');
    // Get the current auth user to make sure we're authenticated
    const { data: authData } = await supabase.auth.getUser();
    console.log('Auth user:', authData?.user?.email || 'Not authenticated');
    
    // With RLS enabled, we don't need to filter by customerid explicitly
    // It will be handled by the RLS policies
    let query = supabase.from('employee').select();
    
    const { data, error } = await query.order('employeeid');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} employees`);
    return (data || []).map(mapEmployeeDBToEmployee);
  } catch (error) {
    console.error('Error in getEmployees:', error);
    throw error;
  }
};

export const getEmployeeById = async (id: number): Promise<Employee | null> => {
  try {
    // Check if this is an admin-added expense (id might be null or 0)
    if (!id || id === 0) {
      return {
        employeeid: 0,
        firstname: 'Admin',
        lastname: 'User',
        email: '',
        // Include other required fields with default values
        address: '',
        city: '',
        state: '',
        country: '',
        postalcode: '', // Fixed: Changed 'zipcode' to 'postalcode' to match Employee interface
        phonenumber: '', // Fixed: Using empty string instead of number
        jobtitle: '',
        department: '',
        employmentstatus: 'Active', // Fixed: Using a valid employmentstatus value
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
    
    // Convert the employee data to database format
    const dbEmployee = mapEmployeeToDBFormat(employee);
    console.log('Formatted employee data for database:', dbEmployee);
    
    // Get the current auth user's ID to use as the customerid
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('You must be logged in to add an employee');
    }
    
    // Ensure customerid is set to the current auth user's ID
    dbEmployee.customerid = userData.user.id;
    console.log('Setting customerid to auth user ID:', userData.user.id);
    
    // Make sure all fields are included in the insert operation
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
    console.log('Updating employee with data:', employee);
    
    // Convert the employee data to database format
    const dbEmployee = mapEmployeeToDBFormat(employee);
    console.log('Formatted employee data for database update:', dbEmployee);
    
    // Make sure all fields are included in the update operation
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
    // Completely delete the employee record from the database
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
