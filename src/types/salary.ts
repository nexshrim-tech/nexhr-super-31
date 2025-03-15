
export interface SalaryAllowances {
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
}

export interface SalaryDeductions {
  incomeTax: number;
  providentFund: number;
  professionalTax: number;
  loanDeduction: number;
  otherDeductions: number;
  esi: number;
}

export interface EmployeeSalary {
  id: number;
  employee: { name: string; avatar: string };
  position: string;
  department: string;
  salary: number;
  lastIncrement: string;
  status: string;
  allowances: SalaryAllowances;
  deductions: SalaryDeductions;
}

export interface PayslipRecord {
  id: string;
  employee: string;
  period: string;
  amount: number;
  date: string;
}

export interface SalaryData {
  month: string;
  amount: number;
}
