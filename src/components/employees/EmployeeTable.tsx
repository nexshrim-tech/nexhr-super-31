
import React from "react";
import { Employee } from "@/services/employeeService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, UserCog, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface EmployeeTableProps {
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onPasswordChange: (employee: Employee) => void;
  isLoading?: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  onViewEmployee, 
  onEditEmployee, 
  onPasswordChange,
  isLoading = false
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading employees...</div>;
  }

  if (!employees || employees.length === 0) {
    return <div className="text-center py-4">No employees found.</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employeeid}>
              <TableCell>
                <span className="font-mono text-sm">
                  {employee.employeeid || `-`}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {employee.profilepicturepath ? (
                      <AvatarImage src={employee.profilepicturepath} alt={employee.firstname} />
                    ) : (
                      <AvatarFallback>{employee.firstname[0]}{employee.lastname[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.firstname} {employee.lastname}</div>
                    <div className="text-xs text-muted-foreground">{employee.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.jobtitle}</TableCell>
              <TableCell>
                <Badge variant="secondary">{employee.employmentstatus}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => onViewEmployee(employee)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEditEmployee(employee)}>
                    <UserCog className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onPasswordChange(employee)}>
                    <KeyRound className="h-4 w-4" />
                  </Button>
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
