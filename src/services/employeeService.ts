
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: number;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: number;
  phonenumber?: string;
  address?: string;
  salary?: number;
  gender?: string;
  dateofbirth?: string | null;
  education?: string;
  employeetype?: string;
  employeestatus?: string;
  workauthorization?: string;
  employmenthistory?: string;
  monthlysalary?: number;
  city?: string;
  state?: string;
  country?: string;
  postalcode?: string;
  terminationdate?: string | null;
  probationenddate?: string | null;
}

export const getEmployees = async (customerId?: number): Promise<Employee[]> => {
  try {
    let query = supabase
      .from('employee')
      .select();
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('employeeid');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return data || [];
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

    return data || null;
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    throw error;
  }
};

export const addEmployee = async (employee: Omit<Employee, 'employeeid'>): Promise<Employee> => {
  try {
    console.log('Adding employee with data:', employee);
    
    // Ensure the employee object has the required fields
    if (!employee.firstname || !employee.lastname || !employee.email) {
      throw new Error('Employee must have firstname, lastname, and email');
    }
    
    // Clean up undefined values to prevent Supabase errors
    // This ensures that undefined values don't cause issues when inserted
    const cleanEmployee = Object.fromEntries(
      Object.entries(employee).filter(([_, value]) => value !== undefined)
    );
    
    // Handle fields that might come in as strings but need to be numbers
    const formattedEmployee = {
      ...cleanEmployee,
      department: cleanEmployee.department ? 
        (typeof cleanEmployee.department === 'string' ? parseInt(cleanEmployee.department as string, 10) : cleanEmployee.department) : 
        null,
      salary: cleanEmployee.salary ? 
        (typeof cleanEmployee.salary === 'string' ? parseFloat(cleanEmployee.salary as string) : cleanEmployee.salary) : 
        null,
      monthlysalary: cleanEmployee.monthlysalary ? 
        (typeof cleanEmployee.monthlysalary === 'string' ? parseFloat(cleanEmployee.monthlysalary as string) : cleanEmployee.monthlysalary) : 
        null
    };
    
    // Handle date fields - convert empty strings to null to avoid database errors
    ['joiningdate', 'dateofbirth', 'terminationdate', 'probationenddate'].forEach(field => {
      if (formattedEmployee[field] === '') {
        formattedEmployee[field] = null;
      }
    });
    
    console.log('Submitting formatted employee data to database:', formattedEmployee);
    
    // Make sure we're passing a properly typed object that includes the required fields
    // Explicitly type the formattedEmployee to match what Supabase expects
    const typedEmployee: {
      firstname: string;
      lastname: string;
      email: string;
      department?: number | null;
      salary?: number | null;
      monthlysalary?: number | null;
      [key: string]: any;
    } = formattedEmployee;
    
    const { data, error } = await supabase
      .from('employee')
      .insert(typedEmployee)
      .select()
      .single();

    if (error) {
      console.error('Error adding employee:', error);
      throw error;
    }

    console.log('Employee added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in addEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: number, employee: Omit<Partial<Employee>, 'employeeid'>): Promise<Employee> => {
  try {
    // Clean up undefined values to prevent Supabase errors
    const cleanEmployee = Object.fromEntries(
      Object.entries(employee).filter(([_, value]) => value !== undefined)
    );
    
    // Sanitize date fields to avoid database errors
    const sanitizedEmployee = { ...cleanEmployee };
    
    // Convert empty string dates to null
    if (sanitizedEmployee.joiningdate === '') sanitizedEmployee.joiningdate = null;
    if (sanitizedEmployee.dateofbirth === '') sanitizedEmployee.dateofbirth = null;
    if (sanitizedEmployee.terminationdate === '') sanitizedEmployee.terminationdate = null;
    if (sanitizedEmployee.probationenddate === '') sanitizedEmployee.probationenddate = null;
    
    console.log('Updating employee with sanitized data:', sanitizedEmployee);
    
    const { data, error } = await supabase
      .from('employee')
      .update(sanitizedEmployee)
      .eq('employeeid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      throw error;
    }

    return data;
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
