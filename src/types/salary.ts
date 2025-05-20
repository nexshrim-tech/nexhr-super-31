
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
