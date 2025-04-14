
import { EmployeeSalary, PayslipRecord } from "@/types/salary";
import { Dispatch, SetStateAction } from "react";

// Employee-related component props
export interface EmployeeListProps {
  employees: any[];
  isLoading: boolean;
  customerId: number | null;
}

export interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  departmentFilter: string;
  setDepartmentFilter: Dispatch<SetStateAction<string>>;
  departments: string[];
  isLoading: boolean;
}

export interface EmployeeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  onSave: () => void;
  departments: { id: number; name: string; }[];
}

// Attendance-related props
export interface TodaysAttendanceProps {
  customerId: number | null;
  isLoading: boolean;
}

export interface EmployeeLocationProps {
  customerId: number | null;
  isLoading: boolean;
}

export interface TaskRemindersProps {
  customerId: number | null;
  isLoading: boolean;
}

// Salary-related props
export interface SalaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeList: { id: number; name: string; department: string; position: string; }[];
  onClose?: () => void;
  onSave?: (formData: any) => void;
}

export interface SalarySlipGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeSalary | null;
}

export interface PayslipHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslips: PayslipRecord[];
  onViewPayslip?: (id: string) => void;
  employee?: EmployeeSalary | null;
}
