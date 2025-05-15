
export interface PayrollItem {
  id: string;
  employee: {
    name: string;
    avatar: string;
  };
  department: string;
  position: string;
  salary: number;
  status: string;
}

export interface SalaryComponent {
  componentName: string;
  amount: number;
  type: 'earning' | 'deduction';
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
  status: string;
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

export interface SalaryDetail {
  id: string;
  year: number;
  month: number;
  employeeId: string;
  components: SalaryComponent[];
  total: number;
  generatedAt: string;
  status: 'draft' | 'processed' | 'paid';
}
