
export interface SalaryAllowances {
  basic: number;
  hra: number;
  transport: number;
  medical: number;
  special: number;
  other: number;
  // Additional fields to match component usage
  basicSalary?: number;
  conveyanceAllowance?: number;
  medicalAllowance?: number;
  specialAllowance?: number;
  otherAllowances?: number;
}

export interface SalaryDeductions {
  pf: number;
  esi: number;
  tax: number;
  loan: number;
  other: number;
  // Additional fields to match component usage
  incomeTax?: number;
  providentFund?: number;
  professionalTax?: number;
  loanDeduction?: number;
  otherDeductions?: number;
}

export interface EmployeeSalary {
  id: string;
  employee: {
    name: string;
    avatar: string;
  };
  position: string;
  department: string;
  salary: number;
  lastIncrement: string;
  status: 'Paid' | 'Pending';
  allowances: SalaryAllowances;
  deductions: SalaryDeductions;
  customerId?: string;
}

export interface PayslipData {
  id: string;
  employeeName: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: SalaryAllowances;
  deductions: SalaryDeductions;
  grossSalary: number;
  netSalary: number;
  generatedDate: string;
}

export interface PayslipRecord {
  id: string;
  employeeName: string;
  month: string;
  year: number;
  amount: number;
  status: string;
  generatedDate: string;
}

export interface SalaryData {
  month: string;
  totalSalary: number;
  totalAllowances: number;
  totalDeductions: number;
}
