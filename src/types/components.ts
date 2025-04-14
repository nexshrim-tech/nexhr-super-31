
import { ReactNode } from 'react';
import { EmployeeSalary, PayslipRecord } from './salary';
import { Dispatch, SetStateAction } from 'react';

// Define prop types for components
export interface TodaysAttendanceProps {
  customerId?: number | null;
  isLoading?: boolean;
}

export interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  departments: string[];
  isLoading: boolean;
}

export interface EmployeeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  onSave: () => void;
  departments: {
    id: number;
    name: string;
  }[];
}

export interface SalaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  onSave?: (formData: any) => void;
  employeeList: {
    id: number;
    name: string;
    department: string;
    position: string;
  }[];
}

export interface SalarySlipGeneratorProps {
  employee: EmployeeSalary; // Change from optional to required
}

export interface PayslipHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslips: PayslipRecord[];
  onViewPayslip: (id: string) => void;
}
