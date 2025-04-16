
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Eye, Key } from "lucide-react";
import { Employee } from "@/services/employeeService";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmployeeTableProps {
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onPasswordChange: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  onViewEmployee,
  onEditEmployee,
  onPasswordChange 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="rounded-md border overflow-hidden shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {!isMobile && <TableHead>Employee ID</TableHead>}
            <TableHead className="min-w-[200px]">Name</TableHead>
            {!isMobile && <TableHead>Department</TableHead>}
            {!isMobile && <TableHead>Role</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employeeid}>
              {!isMobile && <TableCell className="font-medium">{employee.employeeid}</TableCell>}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white text-xs sm:text-sm">
                      {`${employee.firstname[0]}${employee.lastname[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {`${employee.firstname} ${employee.lastname}`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">{employee.email}</div>
                    {isMobile && (
                      <div className="text-xs text-gray-500 mt-1">
                        {employee.jobtitle}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              {!isMobile && <TableCell>{employee.department}</TableCell>}
              {!isMobile && <TableCell>{employee.jobtitle}</TableCell>}
              <TableCell>
                <Badge
                  className={`${
                    employee.employeestatus === "Active"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  } transition-colors text-xs`}
                >
                  {employee.employeestatus || 'Active'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 hover:bg-gray-100 transition-colors text-xs"
                    onClick={() => onEditEmployee(employee)}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 hover:bg-indigo-100 hover:text-indigo-700 transition-colors text-xs"
                    onClick={() => onPasswordChange(employee)}
                  >
                    <Key className="h-3 w-3" />
                    Password
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 hover:bg-nexhr-primary/10 hover:text-nexhr-primary transition-colors text-xs"
                    onClick={() => onViewEmployee(employee)}
                  >
                    <Eye className="h-3 w-3" />
                    View
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
