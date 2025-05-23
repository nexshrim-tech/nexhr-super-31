
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
  id: string; // Changed from number to string to match UUID
  employee: { name: string; avatar: string };
  position: string;
  department: string;
  salary: number;
  lastIncrement: string;
  status: string;
  allowances: SalaryAllowances;
  deductions: SalaryDeductions;
  payslipId?: string;
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

export interface SalaryRecord {
  salaryid: string; // Changed to string
  employeeid: string; // Changed to string
  customerid: string; // Changed to string
  basicsalary: number;
  hra: number;
  conveyanceallowance: number;
  medicalallowance: number;
  specialallowance: number;
  otherallowance: number;
  incometax: number;
  pf: number;
  professionaltax: number;
  esiemployee: number;
  loandeduction: number;
  otherdeduction: number;
}

export interface PayslipDBRecord {
  payslip_id: string; // Match exact database column name
  employeeid: string;
  customerid: string;
  amount: number;
  payslipdate: string;
  generatedtimestamp: string;
}
