
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
  allowances: {
    basicSalary: number;
    hra: number;
    conveyanceAllowance: number;
    medicalAllowance: number;
    specialAllowance: number;
    otherAllowances: number;
  };
  deductions: {
    incomeTax: number;
    providentFund: number;
    professionalTax: number;
    esi: number;
    loanDeduction: number;
    otherDeductions: number;
  };
}

export interface PayslipRecord {
  id: string;
  employee: string;
  period: string;
  amount: number;
  date: string;
}

// Define SalaryData type for trends
export interface SalaryData {
  month: string;
  amount: number;
}

// Define SalaryAllowances type
export interface SalaryAllowances {
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
}

// Define SalaryDeductions type
export interface SalaryDeductions {
  incomeTax: number;
  providentFund: number;
  professionalTax: number;
  esi: number;
  loanDeduction: number;
  otherDeductions: number;
}
