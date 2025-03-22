
import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  jobtitle?: string;
  email?: string;
  gender?: string;
  nationality?: string;
  maritalstatus?: string;
  department?: number;
  worklocation?: string;
  employmenttype?: string;
  leavebalance?: number;
  profilepicturepath?: string;
  joiningdate?: string;
}

export interface EmployeeListItem {
  id: number | string;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  avatar?: string;
}

// Fetch all employees for the current customer
export const fetchEmployees = async (customerId?: number): Promise<Employee[]> => {
  try {
    // Get customer ID if not provided
    if (!customerId) {
      const { data: customerData } = await supabase.rpc('get_current_customer_id');
      customerId = customerData;
    }

    if (!customerId) {
      throw new Error('Customer ID not found');
    }

    const { data, error } = await supabase
      .from('employee')
      .select(`
        employeeid,
        firstname,
        lastname,
        email,
        gender,
        nationality,
        maritalstatus,
        jobtitle,
        department,
        worklocation,
        employmenttype,
        leavebalance,
        profilepicturepath,
        joiningdate
      `)
      .eq('customerid', customerId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Get a single employee by ID
export const fetchEmployeeById = async (employeeId: number): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select(`
        employeeid,
        firstname,
        lastname,
        email,
        gender,
        nationality,
        maritalstatus,
        jobtitle,
        department,
        worklocation,
        employmenttype,
        leavebalance,
        profilepicturepath,
        joiningdate
      `)
      .eq('employeeid', employeeId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${employeeId}:`, error);
    throw error;
  }
};

// Map employee data to a standardized format for UI components
export const mapEmployeeToListItem = (employee: Employee): EmployeeListItem => {
  return {
    id: employee.employeeid,
    name: `${employee.firstname} ${employee.lastname}`,
    position: employee.jobtitle,
    email: employee.email,
    avatar: employee.profilepicturepath || `${employee.firstname[0]}${employee.lastname[0]}`
  };
};

// Get employee department name
export const getEmployeeDepartment = async (departmentId: number): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('department')
      .select('departmentname')
      .eq('departmentid', departmentId)
      .maybeSingle();

    if (error) throw error;
    return data?.departmentname || 'Unknown Department';
  } catch (error) {
    console.error(`Error fetching department name for ID ${departmentId}:`, error);
    return 'Unknown Department';
  }
};

// Format employee avatar
export const getEmployeeAvatar = (employee: Employee): string => {
  if (employee.profilepicturepath) {
    return employee.profilepicturepath;
  }
  return `${employee.firstname?.[0] || ''}${employee.lastname?.[0] || ''}`;
};

