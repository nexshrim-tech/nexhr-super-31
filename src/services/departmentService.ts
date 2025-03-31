
import { supabase } from '@/integrations/supabase/client';

export interface Department {
  departmentid: number;
  departmentname: string;
  customerid?: number;
  numberofemployees?: number;
  annualbudget?: number;
  managerid?: number;
  departmentstatus?: string;
}

export const getDepartments = async (customerId?: number): Promise<Department[]> => {
  try {
    let query = supabase
      .from('department')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('departmentname');

    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDepartments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id: number): Promise<Department | null> => {
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

    return data;
  } catch (error) {
    console.error('Error in getDepartmentById:', error);
    throw error;
  }
};

export const addDepartment = async (department: Omit<Department, 'departmentid'>): Promise<Department> => {
  try {
    const { data, error } = await supabase
      .from('department')
      .insert([department])
      .select()
      .single();

    if (error) {
      console.error('Error adding department:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addDepartment:', error);
    throw error;
  }
};

export const updateDepartment = async (id: number, department: Omit<Partial<Department>, 'departmentid'>): Promise<Department> => {
  try {
    const { data, error } = await supabase
      .from('department')
      .update(department)
      .eq('departmentid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating department:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateDepartment:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {
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
