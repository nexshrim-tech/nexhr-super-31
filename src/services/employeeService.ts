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
  customerid?: string | number;
  phonenumber?: string;
  address?: string;
  monthlysalary?: number;
  gender?: string;
  dateofbirth?: string | null;
  education?: string | undefined;
  employmenttype?: string | undefined;
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

interface EmployeeDB {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string | number;
  address?: string;
  gender?: string;
  dateofbirth?: string | null;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  monthlysalary?: number;
  bloodgroup?: string;
  disabilitystatus?: string;
  documentpath?: string;
  education?: string | undefined;
  employmentstatus?: string;
  employmenttype?: string | undefined;
  workauthorization?: string | undefined;
  employmenthistory?: string | undefined;
  phonenumber?: number;
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

    return (data || []).map((emp: any) => ({
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
      monthlysalary: emp.monthlysalary,
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
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
    
    const emp = data as any;
    
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
      monthlysalary: emp.monthlysalary,
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
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
    
    if (!employee.firstname || !employee.lastname || !employee.email) {
      throw new Error('Employee must have firstname, lastname, and email');
    }
    
    const cleanEmployee = Object.fromEntries(
      Object.entries(employee).filter(([_, value]) => value !== undefined)
    );
    
    if (!cleanEmployee.customerid) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
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
    
    const dbEmployee: Record<string, any> = {
      ...cleanEmployee,
      employmentstatus: cleanEmployee.employmentstatus || 'Active',
      monthlysalary: cleanEmployee.monthlysalary ? 
        (typeof cleanEmployee.monthlysalary === 'string' ? parseFloat(cleanEmployee.monthlysalary as string) : cleanEmployee.monthlysalary) : 
        null,
    };
    
    if (dbEmployee.department && typeof dbEmployee.department === 'string') {
      const departmentId = parseInt(dbEmployee.department);
      if (!isNaN(departmentId)) {
        dbEmployee.department = departmentId;
      } else {
        delete dbEmployee.department;
      }
    }
    
    ['joiningdate', 'dateofbirth', 'terminationdate', 'probationenddate'].forEach(field => {
      if (dbEmployee[field] === '') {
        dbEmployee[field] = null;
      }
    });
    
    if (dbEmployee.employmenttype) {
      // Correct mapping - don't try to rename the field as it's already correct
      // We keep employmenttype as is
    }
    
    if (dbEmployee.postalcode) {
      dbEmployee.zipcode = dbEmployee.postalcode;
      delete dbEmployee.postalcode;
    }
    
    if (dbEmployee.phonenumber !== undefined) {
      if (typeof dbEmployee.phonenumber === 'string' && dbEmployee.phonenumber.trim() !== '') {
        const parsedPhone = parseInt(dbEmployee.phonenumber, 10);
        dbEmployee.phonenumber = !isNaN(parsedPhone) ? parsedPhone : null;
      } else if (typeof dbEmployee.phonenumber !== 'number') {
        dbEmployee.phonenumber = null;
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

    console.log('Employee added successfully:', data);
    
    const emp = data as any;
    
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
      monthlysalary: emp.monthlysalary,
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
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
    const cleanEmployee = Object.fromEntries(
      Object.entries(employee).filter(([_, value]) => value !== undefined)
    );
    
    const dbEmployee: Record<string, any> = {
      ...cleanEmployee,
      gender: cleanEmployee.gender || null,
    };
    
    if (dbEmployee.joiningdate === '') dbEmployee.joiningdate = null;
    if (dbEmployee.dateofbirth === '') dbEmployee.dateofbirth = null;
    if (dbEmployee.terminationdate === '') dbEmployee.terminationdate = null;
    if (dbEmployee.probationenddate === '') dbEmployee.probationenddate = null;
    
    if (dbEmployee.employmenttype) {
      // Correct mapping - keep as is
    }
    
    if (dbEmployee.postalcode) {
      dbEmployee.zipcode = dbEmployee.postalcode;
      delete dbEmployee.postalcode;
    }
    
    if (dbEmployee.monthlysalary !== undefined) {
      dbEmployee.monthlysalary = typeof dbEmployee.monthlysalary === 'string' 
        ? parseFloat(dbEmployee.monthlysalary) 
        : dbEmployee.monthlysalary;
    }
    
    if (dbEmployee.phonenumber !== undefined) {
      if (typeof dbEmployee.phonenumber === 'string' && dbEmployee.phonenumber.trim() !== '') {
        const parsedPhone = parseInt(dbEmployee.phonenumber, 10);
        dbEmployee.phonenumber = !isNaN(parsedPhone) ? parsedPhone : null;
      } else if (typeof dbEmployee.phonenumber !== 'number') {
        dbEmployee.phonenumber = null;
      }
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

    const emp = data as any;

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
      monthlysalary: emp.monthlysalary,
      education: emp.education,
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      workauthorization: emp.workauthorization,
      employmenthistory: emp.employmenthistory,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
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
