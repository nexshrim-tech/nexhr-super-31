
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

// Mock data function - replace with real implementation once DB is set up
export const getSalaries = async (customerId?: number): Promise<Salary[]> => {
  try {
    // Mock data until the database schema is updated
    const mockSalaries: Salary[] = [
      {
        salaryid: 1,
        employeeid: 1,
        basesalary: 50000,
        allowances: 10000,
        deductions: 5000,
        netsalary: 55000,
        effectivedate: new Date().toISOString(),
        currency: 'INR',
        paycycle: 'monthly',
        customerid: customerId || 1
      },
      {
        salaryid: 2,
        employeeid: 2,
        basesalary: 60000,
        allowances: 12000,
        deductions: 6000,
        netsalary: 66000,
        effectivedate: new Date().toISOString(),
        currency: 'INR',
        paycycle: 'monthly',
        customerid: customerId || 1
      }
    ];
    
    return mockSalaries;
  } catch (error) {
    console.error('Error in getSalaries:', error);
    throw error;
  }
};

export const getSalaryByEmployeeId = async (employeeId: number): Promise<Salary | null> => {
  try {
    // Mock data until the database schema is updated
    const mockSalary: Salary = {
      salaryid: 1,
      employeeid: employeeId,
      basesalary: 50000,
      allowances: 10000,
      deductions: 5000,
      netsalary: 55000,
      effectivedate: new Date().toISOString(),
      currency: 'INR',
      paycycle: 'monthly',
    };
    
    return mockSalary;
  } catch (error) {
    console.error('Error in getSalaryByEmployeeId:', error);
    throw error;
  }
};

export const addSalary = async (salary: Omit<Salary, 'salaryid'>): Promise<Salary> => {
  try {
    // Mock implementation
    const newSalary: Salary = {
      ...salary,
      salaryid: Math.floor(Math.random() * 1000),
    };
    
    return newSalary;
  } catch (error) {
    console.error('Error in addSalary:', error);
    throw error;
  }
};

export const updateSalary = async (id: number, salary: Omit<Partial<Salary>, 'salaryid'>): Promise<Salary> => {
  try {
    // Mock implementation
    const updatedSalary: Salary = {
      salaryid: id,
      employeeid: salary.employeeid || 1,
      basesalary: salary.basesalary || 50000,
      netsalary: salary.netsalary || 55000,
      effectivedate: salary.effectivedate || new Date().toISOString(),
    };
    
    return updatedSalary;
  } catch (error) {
    console.error('Error in updateSalary:', error);
    throw error;
  }
};

export const getAllowancesDeductions = async (salaryId: number): Promise<SalaryAllowanceDeduction[]> => {
  try {
    // Mock data
    const mockAllowancesDeductions: SalaryAllowanceDeduction[] = [
      {
        id: 1,
        salaryid: salaryId,
        type: 'allowance',
        name: 'HRA',
        amount: 10000,
        ispercentage: false,
        ispermanent: true
      },
      {
        id: 2,
        salaryid: salaryId,
        type: 'deduction',
        name: 'Tax',
        amount: 5000,
        ispercentage: false,
        ispermanent: true
      }
    ];
    
    return mockAllowancesDeductions;
  } catch (error) {
    console.error('Error in getAllowancesDeductions:', error);
    throw error;
  }
};

export const getSalaryHistory = async (employeeId: number): Promise<Salary[]> => {
  try {
    // Mock data
    const mockSalaryHistory: Salary[] = [
      {
        salaryid: 1,
        employeeid: employeeId,
        basesalary: 45000,
        netsalary: 50000,
        effectivedate: '2023-01-01T00:00:00Z',
        enddate: '2023-06-30T00:00:00Z',
      },
      {
        salaryid: 2,
        employeeid: employeeId,
        basesalary: 50000,
        netsalary: 55000,
        effectivedate: '2023-07-01T00:00:00Z',
      },
    ];
    
    return mockSalaryHistory;
  } catch (error) {
    console.error('Error in getSalaryHistory:', error);
    throw error;
  }
};
