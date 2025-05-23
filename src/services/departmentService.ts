
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/department';

export const getDepartments = async (customerId?: string): Promise<Department[]> => {
  try {
    let query = supabase
      .from('department')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('departmentid');

    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }

    return (data || []).map(item => ({
      departmentid: item.departmentid,
      customerid: item.customerid,
      departmentname: item.departmentname || undefined,
      departmentstatus: item.departmentstatus || undefined,
      managerid: item.managerid,
      numberofemployees: item.numberofemployees || undefined,
      annualbudget: item.annualbudget || undefined
    })) as Department[];
  } catch (error) {
    console.error('Error in getDepartments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id: string): Promise<Department | null> => {
  try {
    const { data, error } = await supabase
      .from('department')
      .select('*')
      .eq('departmentid', id)
      .single();

    if (error) {
      console.error('Error fetching department by ID:', error);
      throw error;
    }

    return {
      departmentid: data.departmentid,
      customerid: data.customerid,
      departmentname: data.departmentname || undefined,
      departmentstatus: data.departmentstatus || undefined,
      managerid: data.managerid,
      numberofemployees: data.numberofemployees || undefined,
      annualbudget: data.annualbudget || undefined
    } as Department;
  } catch (error) {
    console.error('Error in getDepartmentById:', error);
    throw error;
  }
};

export const createDepartment = async (department: Omit<Department, 'departmentid'>): Promise<Department> => {
  try {
    if (!department.customerid || !department.managerid) {
      throw new Error('Customer ID and Manager ID are required');
    }
    
    const { data, error } = await supabase
      .from('department')
      .insert({
        customerid: department.customerid,
        departmentname: department.departmentname,
        departmentstatus: department.departmentstatus,
        managerid: department.managerid,
        numberofemployees: department.numberofemployees,
        annualbudget: department.annualbudget
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating department:', error);
      throw error;
    }

    return {
      departmentid: data.departmentid,
      customerid: data.customerid,
      departmentname: data.departmentname || undefined,
      departmentstatus: data.departmentstatus || undefined,
      managerid: data.managerid,
      numberofemployees: data.numberofemployees || undefined,
      annualbudget: data.annualbudget || undefined
    } as Department;
  } catch (error) {
    console.error('Error in createDepartment:', error);
    throw error;
  }
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  try {
    const { data, error } = await supabase
      .from('department')
      .update({
        departmentname: updates.departmentname,
        departmentstatus: updates.departmentstatus,
        customerid: updates.customerid,
        managerid: updates.managerid,
        numberofemployees: updates.numberofemployees,
        annualbudget: updates.annualbudget
      })
      .eq('departmentid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating department:', error);
      throw error;
    }

    return {
      departmentid: data.departmentid,
      customerid: data.customerid,
      departmentname: data.departmentname || undefined,
      departmentstatus: data.departmentstatus || undefined,
      managerid: data.managerid,
      numberofemployees: data.numberofemployees || undefined,
      annualbudget: data.annualbudget || undefined
    } as Department;
  } catch (error) {
    console.error('Error in updateDepartment:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('department')
      .delete()
      .eq('departmentid', id);

    if (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteDepartment:', error);
    throw error;
  }
};

export type { Department };
