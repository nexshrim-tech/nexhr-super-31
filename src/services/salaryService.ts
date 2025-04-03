
import { supabase } from '@/integrations/supabase/client';

export interface Salary {
  salaryid: number;
  employeeid: number;
  basesalary: number;
  allowances?: number;
  deductions?: number;
  netsalary: number;
  effectivedate: string;
  enddate?: string;
  currency?: string;
  paycycle?: string;
  bankaccountnumber?: string;
  bankname?: string;
  ifsccode?: string;
  lastpaymentdate?: string;
  paymentreference?: string;
  paymentmethod?: string;
  customerid?: number;
}

export interface SalaryAllowanceDeduction {
  id: number;
  salaryid: number;
  type: string; // 'allowance' or 'deduction'
  name: string;
  amount: number;
  ispercentage: boolean;
  ispermanent: boolean;
}

export const getSalaries = async (customerId?: number): Promise<Salary[]> => {
  try {
    let query = supabase
      .from('salary')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching salaries:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSalaries:', error);
    throw error;
  }
};

export const getSalaryByEmployeeId = async (employeeId: number): Promise<Salary | null> => {
  try {
    const { data, error } = await supabase
      .from('salary')
      .select('*')
      .eq('employeeid', employeeId)
      .is('enddate', null) // Get current active salary
      .maybeSingle();

    if (error) {
      console.error('Error fetching salary by employee ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getSalaryByEmployeeId:', error);
    throw error;
  }
};

export const addSalary = async (salary: Omit<Salary, 'salaryid'>): Promise<Salary> => {
  try {
    const { data, error } = await supabase
      .from('salary')
      .insert([salary])
      .select()
      .single();

    if (error) {
      console.error('Error adding salary:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addSalary:', error);
    throw error;
  }
};

export const updateSalary = async (id: number, salary: Omit<Partial<Salary>, 'salaryid'>): Promise<Salary> => {
  try {
    const { data, error } = await supabase
      .from('salary')
      .update(salary)
      .eq('salaryid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating salary:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSalary:', error);
    throw error;
  }
};

export const getAllowancesDeductions = async (salaryId: number): Promise<SalaryAllowanceDeduction[]> => {
  try {
    const { data, error } = await supabase
      .from('salaryallowancededuction')
      .select('*')
      .eq('salaryid', salaryId);

    if (error) {
      console.error('Error fetching allowances/deductions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllowancesDeductions:', error);
    throw error;
  }
};

export const getSalaryHistory = async (employeeId: number): Promise<Salary[]> => {
  try {
    const { data, error } = await supabase
      .from('salary')
      .select('*')
      .eq('employeeid', employeeId)
      .order('effectivedate', { ascending: false });

    if (error) {
      console.error('Error fetching salary history:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSalaryHistory:', error);
    throw error;
  }
};
