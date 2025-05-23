
export interface SalaryAllowances {
  basic: number;
  hra: number;
  transport: number;
  medical: number;
  special: number;
  other: number;
}

export interface SalaryDeductions {
  pf: number;
  esi: number;
  tax: number;
  loan: number;
  other: number;
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
