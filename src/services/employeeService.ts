
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
    
    // Ensure customerid is set
    if (!employee.customerid) {
      console.warn('Warning: customerid not provided, using default value');
      employee.customerid = 1; // Default value for customerid
    }
    
    // Handle fields that might come in as strings but need to be numbers
    const formattedEmployee = {
      ...employee,
      department: employee.department ? 
        (typeof employee.department === 'string' ? parseInt(employee.department) : employee.department) : 
        undefined,
      salary: employee.salary ? 
        (typeof employee.salary === 'string' ? parseFloat(employee.salary) : employee.salary) : 
        undefined,
      monthlysalary: employee.monthlysalary ? 
        (typeof employee.monthlysalary === 'string' ? parseFloat(employee.monthlysalary) : employee.monthlysalary) : 
        undefined
    };
    
    // Handle date fields - convert empty strings to null to avoid database errors
    ['joiningdate', 'dateofbirth', 'terminationdate', 'probationenddate'].forEach(field => {
      if (formattedEmployee[field] === '') {
        formattedEmployee[field] = null;
      }
    });
    
    console.log('Submitting formatted employee data to database:', formattedEmployee);
    
    const { data, error } = await supabase
      .from('employee')
      .insert([formattedEmployee])
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
    // Sanitize date fields to avoid database errors
    const sanitizedEmployee = { ...employee };
    
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
