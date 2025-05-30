
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/types/employee";

interface AttendanceFiltersProps {
  employees: Employee[];
  selectedEmployee: string;
  selectedStatus: string;
  onEmployeeChange: (employeeId: string) => void;
  onStatusChange: (status: string) => void;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  employees,
  selectedEmployee,
  selectedStatus,
  onEmployeeChange,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Employee</label>
        <Select value={selectedEmployee || "all"} onValueChange={onEmployeeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.employeeid} value={employee.employeeid}>
                {employee.firstname} {employee.lastname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={selectedStatus || "all"} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="half day">Half Day</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
