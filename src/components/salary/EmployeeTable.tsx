
import React from "react";
import { format } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, History, Edit } from "lucide-react";
import { EmployeeSalary } from "@/types/salary";

interface EmployeeTableProps {
  employees: EmployeeSalary[];
  onGenerateSalarySlip: (employee: EmployeeSalary) => void;
  onViewHistory?: (employee: EmployeeSalary) => void;
  onUpdateSalaryDetails?: (employee: EmployeeSalary) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  onGenerateSalarySlip, 
  onViewHistory,
  onUpdateSalaryDetails
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Last Increment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{employee.employee.avatar}</AvatarFallback>
                  </Avatar>
                  <span>{employee.employee.name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
              <TableCell>{format(new Date(employee.lastIncrement), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <Badge 
                  variant={employee.status === "Paid" ? "default" : "secondary"}
                  className={employee.status === "Paid" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}
                >
                  {employee.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onGenerateSalarySlip(employee)}
                    title="Generate Salary Slip"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  {onViewHistory && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewHistory(employee)}
                      title="View Payslip History"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  )}
                  {onUpdateSalaryDetails && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onUpdateSalaryDetails(employee)}
                      title="Edit Salary Details"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
