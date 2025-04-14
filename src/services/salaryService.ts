
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define the Salary type based on the database schema
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

// Mock data for development
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
    paycycle: 'Monthly'
  }
];

// Get all salaries for a customer
export const getSalaries = async (customerId?: number): Promise<Salary[]> => {
  try {
    // Use the mock data for development since table might not exist yet
    console.log("Fetching salaries for customer:", customerId);
    return mockSalaries;
  } catch (error) {
    console.error('Error in getSalaries:', error);
    throw error;
  }
};

// Get salary for a specific employee
export const getSalaryByEmployeeId = async (employeeId: number): Promise<Salary | null> => {
  try {
    console.log("Fetching salary for employee:", employeeId);
    const salary = mockSalaries.find(s => s.employeeid === employeeId);
    return salary || null;
  } catch (error) {
    console.error('Error in getSalaryByEmployeeId:', error);
    throw error;
  }
};

// Add a new salary
export const addSalary = async (salary: Omit<Salary, 'salaryid'>): Promise<Salary> => {
  try {
    console.log("Adding new salary:", salary);
    const newSalary = {
      ...salary,
      salaryid: mockSalaries.length + 1
    };
    mockSalaries.push(newSalary);
    return newSalary;
  } catch (error) {
    console.error('Error in addSalary:', error);
    throw error;
  }
};

// Update an existing salary
export const updateSalary = async (id: number, salary: Omit<Partial<Salary>, 'salaryid'>): Promise<Salary> => {
  try {
    console.log("Updating salary:", id, salary);
    const index = mockSalaries.findIndex(s => s.salaryid === id);
    if (index !== -1) {
      mockSalaries[index] = { ...mockSalaries[index], ...salary };
      return mockSalaries[index];
    }
    throw new Error(`Salary with ID ${id} not found`);
  } catch (error) {
    console.error('Error in updateSalary:', error);
    throw error;
  }
};

// Get all allowances and deductions for a salary
export const getAllowancesDeductions = async (salaryId: number): Promise<SalaryAllowanceDeduction[]> => {
  try {
    console.log("Fetching allowances/deductions for salary:", salaryId);
    // Mock data for development
    return [
      {
        id: 1,
        salaryid: salaryId,
        type: 'allowance',
        name: 'HRA',
        amount: 5000,
        ispercentage: false,
        ispermanent: true
      },
      {
        id: 2,
        salaryid: salaryId,
        type: 'deduction',
        name: 'PF',
        amount: 1800,
        ispercentage: false,
        ispermanent: true
      }
    ];
  } catch (error) {
    console.error('Error in getAllowancesDeductions:', error);
    throw error;
  }
};

// Get salary history for an employee
export const getSalaryHistory = async (employeeId: number): Promise<Salary[]> => {
  try {
    console.log("Fetching salary history for employee:", employeeId);
    return mockSalaries.filter(s => s.employeeid === employeeId);
  } catch (error) {
    console.error('Error in getSalaryHistory:', error);
    throw error;
  }
};
