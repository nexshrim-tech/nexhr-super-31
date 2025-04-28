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
  employmenttype?: string | undefined;
  employmentstatus?: 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation';
  city?: string;
  state?: string;
  country?: string;
  postalcode?: string;
  terminationdate?: string | null;
  probationenddate?: string | null;
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
  disabilitystatus?: string;
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
  employmentstatus?: string;
  employmenttype?: string | undefined;
  employmenthistory?: string | undefined;
  phonenumber?: number;
  terminationdate?: string | null;
  probationenddate?: string | null;
  fathersname?: string;
  maritalstatus?: string;
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
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate,
      bloodgroup: emp.bloodgroup,
      fathersname: emp.fathersname,
      maritalstatus: emp.maritalstatus,
      disabilitystatus: emp.disabilitystatus
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
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate,
      bloodgroup: emp.bloodgroup,
      fathersname: emp.fathersname,
      maritalstatus: emp.maritalstatus,
      disabilitystatus: emp.disabilitystatus
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
    
    const dbEmployee: Record<string, any> = {
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      jobtitle: employee.jobtitle || null,
      department: employee.department || null,
      joiningdate: employee.joiningdate || null,
      profilepicturepath: employee.profilepicturepath || null,
      customerid: employee.customerid || null,
      address: employee.address || null,
      gender: employee.gender || null,
      dateofbirth: employee.dateofbirth || null,
      city: employee.city || null,
      state: employee.state || null,
      country: employee.country || null,
      employmentstatus: employee.employmentstatus || 'Active',
      employmenttype: employee.employmenttype || null,
      terminationdate: employee.terminationdate || null,
      probationenddate: employee.probationenddate || null,
      bloodgroup: employee.bloodgroup || null,
      maritalstatus: employee.maritalstatus || null,
      disabilitystatus: employee.disabilitystatus || null,
      fathersname: employee.fathersname || null
    };
    
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
    
    if (employee.monthlysalary !== undefined) {
      dbEmployee.monthlysalary = typeof employee.monthlysalary === 'string' ? 
        parseFloat(employee.monthlysalary as string) : employee.monthlysalary;
    }
    
    if (dbEmployee.department && typeof dbEmployee.department === 'string') {
      const departmentId = parseInt(dbEmployee.department);
      if (!isNaN(departmentId)) {
        dbEmployee.department = departmentId;
      }
    }
    
    if (employee.postalcode) {
      dbEmployee.zipcode = employee.postalcode;
    }
    
    if (employee.phonenumber !== undefined) {
      if (typeof employee.phonenumber === 'string' && employee.phonenumber.trim() !== '') {
        const parsedPhone = parseInt(employee.phonenumber, 10);
        dbEmployee.phonenumber = !isNaN(parsedPhone) ? parsedPhone : null;
      } else if (typeof employee.phonenumber !== 'number') {
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
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate,
      bloodgroup: emp.bloodgroup,
      fathersname: emp.fathersname,
      maritalstatus: emp.maritalstatus,
      disabilitystatus: emp.disabilitystatus
    };
  } catch (error) {
    console.error('Error in addEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: number, employee: Omit<Partial<Employee>, 'employeeid'>): Promise<Employee> => {
  try {
    const dbEmployee: Record<string, any> = {};
    
    if ('firstname' in employee) dbEmployee.firstname = employee.firstname || null;
    if ('lastname' in employee) dbEmployee.lastname = employee.lastname || null;
    if ('email' in employee) dbEmployee.email = employee.email || null;
    if ('jobtitle' in employee) dbEmployee.jobtitle = employee.jobtitle || null;
    if ('department' in employee) dbEmployee.department = employee.department || null;
    if ('address' in employee) dbEmployee.address = employee.address || null;
    if ('gender' in employee) dbEmployee.gender = employee.gender || null;
    if ('city' in employee) dbEmployee.city = employee.city || null;
    if ('state' in employee) dbEmployee.state = employee.state || null;
    if ('country' in employee) dbEmployee.country = employee.country || null;
    if ('employmentstatus' in employee) dbEmployee.employmentstatus = employee.employmentstatus || null;
    if ('employmenttype' in employee) dbEmployee.employmenttype = employee.employmenttype || null;
    if ('bloodgroup' in employee) dbEmployee.bloodgroup = employee.bloodgroup || null;
    if ('fathersname' in employee) dbEmployee.fathersname = employee.fathersname || null;
    if ('maritalstatus' in employee) dbEmployee.maritalstatus = employee.maritalstatus || null;
    if ('disabilitystatus' in employee) dbEmployee.disabilitystatus = employee.disabilitystatus || null;
    if ('profilepicturepath' in employee) dbEmployee.profilepicturepath = employee.profilepicturepath || null;
    
    if ('joiningdate' in employee) dbEmployee.joiningdate = employee.joiningdate === '' ? null : employee.joiningdate;
    if ('dateofbirth' in employee) dbEmployee.dateofbirth = employee.dateofbirth === '' ? null : employee.dateofbirth;
    if ('terminationdate' in employee) dbEmployee.terminationdate = employee.terminationdate === '' ? null : employee.terminationdate;
    if ('probationenddate' in employee) dbEmployee.probationenddate = employee.probationenddate === '' ? null : employee.probationenddate;
    
    if ('postalcode' in employee) {
      dbEmployee.zipcode = employee.postalcode || null;
    }
    
    if ('monthlysalary' in employee) {
      dbEmployee.monthlysalary = employee.monthlysalary !== undefined ? 
        (typeof employee.monthlysalary === 'string' ? parseFloat(employee.monthlysalary) : employee.monthlysalary) : null;
    }
    
    if ('phonenumber' in employee) {
      if (employee.phonenumber) {
        if (typeof employee.phonenumber === 'string' && employee.phonenumber.trim() !== '') {
          const parsedPhone = parseInt(employee.phonenumber, 10);
          dbEmployee.phonenumber = !isNaN(parsedPhone) ? parsedPhone : null;
        } else if (typeof employee.phonenumber === 'number') {
          dbEmployee.phonenumber = employee.phonenumber;
        } else {
          dbEmployee.phonenumber = null;
        }
      } else {
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
      employmentstatus: emp.employmentstatus as any,
      employmenttype: emp.employmenttype,
      phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
      terminationdate: emp.terminationdate,
      probationenddate: emp.probationenddate,
      bloodgroup: emp.bloodgroup,
      fathersname: emp.fathersname,
      maritalstatus: emp.maritalstatus,
      disabilitystatus: emp.disabilitystatus
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
