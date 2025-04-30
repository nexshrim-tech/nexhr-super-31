
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
    
    // Set default values for fields that might be undefined
    const employeeWithDefaults = {
      ...employee,
      fathersname: employee.fathersname || '',
      dateofbirth: employee.dateofbirth || null,
      nationality: employee.nationality || '',
      maritalstatus: employee.maritalstatus || '',
      worklocation: employee.worklocation || '',
      employmenttype: employee.employmenttype || '',
      bloodgroup: employee.bloodgroup || '',
      disabilitystatus: employee.disabilitystatus || '',
      employeepassword: employee.employeepassword || '',
      documentpath: employee.documentpath || '',
      leavebalance: employee.leavebalance || 0,
      profilepicturepath: employee.profilepicturepath || '',
      monthlysalary: employee.monthlysalary || 0
    };
    
    const dbEmployee = mapEmployeeToDBFormat(employeeWithDefaults);
    console.log('Formatted employee data for database:', dbEmployee);
    
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
    
    // Ensure we're not sending undefined values that would override existing data with nulls
    const cleanedEmployee = Object.entries(employee).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Set empty strings to proper defaults for certain fields
    if (cleanedEmployee.fathersname === '') cleanedEmployee.fathersname = null;
    if (cleanedEmployee.nationality === '') cleanedEmployee.nationality = null;
    if (cleanedEmployee.maritalstatus === '') cleanedEmployee.maritalstatus = null;
    if (cleanedEmployee.worklocation === '') cleanedEmployee.worklocation = null;
    if (cleanedEmployee.employmenttype === '') cleanedEmployee.employmenttype = null;
    if (cleanedEmployee.bloodgroup === '') cleanedEmployee.bloodgroup = null;
    if (cleanedEmployee.disabilitystatus === '') cleanedEmployee.disabilitystatus = null;
    if (cleanedEmployee.documentpath === '') cleanedEmployee.documentpath = null;
    if (cleanedEmployee.profilepicturepath === '') cleanedEmployee.profilepicturepath = null;
    
    const dbEmployee = mapEmployeeToDBFormat(cleanedEmployee);
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
