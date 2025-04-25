
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string | number; // Updated to support both string (UUID) and number
  phonenumber?: string;
  address?: string;
  monthlysalary?: number; // Changed from salary to monthlysalary
  gender?: string;
  dateofbirth?: string | null;
  education?: string | undefined;
  employeetype?: string | undefined;
  employmentstatus?: 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation';
  workauthorization?: string | undefined;
  employmenthistory?: string | undefined;
  city?: string;
  state?: string;
  country?: string;
  postalcode?: string;
  terminationdate?: string | null;
  probationenddate?: string | null;
  company_employee_id?: string;
}

// Interface for the database employee record
interface EmployeeDB {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string | number; // Updated to support both string (UUID) and number
  address?: string;
  gender?: string;
  dateofbirth?: string | null;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  monthlysalary?: number; // Added to match the database column
  // Additional fields from DB that might be missing in the current interface
  bloodgroup?: string;
  disabilitystatus?: string;
  documentpath?: string;
  education?: string | undefined;
  employmentstatus?: string;
  employmenttype?: string | undefined;
  workauthorization?: string | undefined;
  employmenthistory?: string | undefined;
  phonenumber?: string;
  company_employee_id?: string;
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

    return (data || []).map((emp: EmployeeDB) => ({
      employeeid: emp.employeeid,
      firstname: emp.firstname || '',
      lastname: emp.lastname || '',
      email: emp.email || '',
      jobtitle: emp.jobtitle,
      department: emp.department || '',
      joiningdate: emp.joiningdate,
      profilepicturepath: emp.profilepicturepath,
      customerid: emp.customerid,
      address: emp.address,
      gender: emp.gender,
      dateofbirth: emp.dateofbirth,
      city: emp.city,
      state: emp.state,
      country: emp.country,
      postalcode: emp.zipcode,
      monthlysalary: emp.monthlysalary, // Map monthlysalary correctly
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employeetype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber,
      company_employee_id: emp.company_employee_id,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate
    }));
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

    if (!data) return null;
    
    const emp = data as EmployeeDB;
    
    return {
      employeeid: emp.employeeid,
      firstname: emp.firstname || '',
      lastname: emp.lastname || '',
      email: emp.email || '',
      jobtitle: emp.jobtitle,
      department: emp.department || '',
      joiningdate: emp.joiningdate,
      profilepicturepath: emp.profilepicturepath,
      customerid: emp.customerid,
      address: emp.address,
      gender: emp.gender,
      dateofbirth: emp.dateofbirth,
      city: emp.city,
      state: emp.state,
      country: emp.country,
      postalcode: emp.zipcode,
      monthlysalary: emp.monthlysalary, // Map monthlysalary correctly
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employeetype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber,
      company_employee_id: emp.company_employee_id,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate
    };
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
    const cleanEmployee = Object.fromEntries(
      Object.entries(employee).filter(([_, value]) => value !== undefined)
    );
    
    // Get current user's customerid if not provided
    if (!cleanEmployee.customerid) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Get the customer directly from the customer table using the auth user's ID
        const { data: customerData } = await supabase
          .from('customer')
          .select('customerid')
          .eq('customerid', userData.user.id)
          .single();

        if (customerData?.customerid) {
          cleanEmployee.customerid = customerData.customerid;
        }
      }
    }
    
    console.log('Submitting formatted employee data to database:', cleanEmployee);
    
    // Convert department field to number if provided as string
    const dbEmployee: Record<string, any> = {
      ...cleanEmployee,
      employmentstatus: cleanEmployee.employmentstatus || 'Active',
      // Use monthlysalary directly
      monthlysalary: cleanEmployee.monthlysalary ? 
        (typeof cleanEmployee.monthlysalary === 'string' ? parseFloat(cleanEmployee.monthlysalary as string) : cleanEmployee.monthlysalary) : 
        null,
    };
    
    // Handle department as number for database
    if (dbEmployee.department && typeof dbEmployee.department === 'string') {
      const departmentId = parseInt(dbEmployee.department);
      if (!isNaN(departmentId)) {
        dbEmployee.department = departmentId;
      } else {
        // If it's not a valid number, remove it
        delete dbEmployee.department;
      }
    }
    
    // Handle date fields - convert empty strings to null
    ['joiningdate', 'dateofbirth', 'terminationdate', 'probationenddate'].forEach(field => {
      if (dbEmployee[field] === '') {
        dbEmployee[field] = null;
      }
    });
    
    // Map employeetype to employmenttype
    if (dbEmployee.employeetype) {
      dbEmployee.employmenttype = dbEmployee.employeetype;
      delete dbEmployee.employeetype;
    }
    
    // Map postalcode to zipcode
    if (dbEmployee.postalcode) {
      dbEmployee.zipcode = dbEmployee.postalcode;
      delete dbEmployee.postalcode;
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

    console.log('Employee added successfully:', data);
    
    const emp = data as EmployeeDB;
    
    // Map database response back to our interface
    return {
      employeeid: emp.employeeid,
      firstname: emp.firstname || '',
      lastname: emp.lastname || '',
      email: emp.email || '',
      jobtitle: emp.jobtitle,
      department: emp.department || '',
      joiningdate: emp.joiningdate,
      profilepicturepath: emp.profilepicturepath,
      customerid: emp.customerid,
      address: emp.address,
      gender: emp.gender,
      dateofbirth: emp.dateofbirth,
      city: emp.city,
      state: emp.state,
      country: emp.country,
      postalcode: emp.zipcode,
      monthlysalary: emp.monthlysalary, // Changed from salary to monthlysalary
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employeetype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber,
      company_employee_id: emp.company_employee_id,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate
    };
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
    
    const dbEmployee: Record<string, any> = { ...cleanEmployee };
    
    // Convert empty string dates to null
    if (dbEmployee.joiningdate === '') dbEmployee.joiningdate = null;
    if (dbEmployee.dateofbirth === '') dbEmployee.dateofbirth = null;
    if (dbEmployee.terminationdate === '') dbEmployee.terminationdate = null;
    if (dbEmployee.probationenddate === '') dbEmployee.probationenddate = null;
    
    // Map employeetype to employmenttype
    if (dbEmployee.employeetype) {
      dbEmployee.employmenttype = dbEmployee.employeetype;
      delete dbEmployee.employeetype;
    }
    
    // Map postalcode to zipcode
    if (dbEmployee.postalcode) {
      dbEmployee.zipcode = dbEmployee.postalcode;
      delete dbEmployee.postalcode;
    }
    
    // Handle monthlysalary conversion if needed
    if (dbEmployee.monthlysalary !== undefined) {
      dbEmployee.monthlysalary = typeof dbEmployee.monthlysalary === 'string' 
        ? parseFloat(dbEmployee.monthlysalary) 
        : dbEmployee.monthlysalary;
    }
    
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

    const emp = data as EmployeeDB;

    // Map database response back to our interface
    return {
      employeeid: emp.employeeid,
      firstname: emp.firstname || '',
      lastname: emp.lastname || '',
      email: emp.email || '',
      jobtitle: emp.jobtitle,
      department: emp.department || '',
      joiningdate: emp.joiningdate,
      profilepicturepath: emp.profilepicturepath,
      customerid: emp.customerid,
      address: emp.address,
      gender: emp.gender,
      dateofbirth: emp.dateofbirth,
      city: emp.city,
      state: emp.state,
      country: emp.country,
      postalcode: emp.zipcode,
      monthlysalary: emp.monthlysalary, // Changed from salary to monthlysalary
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employeetype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber,
      company_employee_id: emp.company_employee_id,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate
    };
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
