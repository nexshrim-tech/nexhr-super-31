
import { ReactNode } from 'react';

// Props for TaskReminders component
export interface TaskRemindersProps {
  customerId: number | null;
  isLoading: boolean;
}

// Props for EmployeeList component
export interface EmployeeListProps {
  employees: any[];
  isLoading: boolean;
  customerId: number | null;
}

// Props for EmployeeLocation component
export interface EmployeeLocationProps {
  customerId: number | null;
  isLoading: boolean;
}

// Props for TodaysAttendance component
export interface TodaysAttendanceProps {
  customerId: number | null;
  isLoading: boolean;
}

// Props for EmployeeStats component
export interface EmployeeStatsProps {
  customerId?: number | null;
  employeeCount?: number;
  isLoading?: boolean;
}

// Props for PayslipHistoryDialog component
export interface PayslipHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslips: any[];
  onViewPayslip: (payslip: any) => void;
}

// Props for SalarySlipGenerator component
export interface SalarySlipGeneratorProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Props for SalaryFormDialog component
export interface SalaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeList: any[];
}

// Props for EmployeeFilters component 
export interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  isLoading: boolean;
  departments: string[];
}

// Props for EmployeeEditDialog component
export interface EmployeeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  onSave: () => void;
  departments: { id: number; name: string; }[];
}
