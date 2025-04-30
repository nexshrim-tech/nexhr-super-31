
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Edit, History } from "lucide-react";
import { EmployeeSalary } from "@/types/salary";

interface EmployeeCardProps {
  employee: EmployeeSalary;
  onGenerateSalarySlip: (employee: EmployeeSalary) => void;
  onViewHistory?: (employee: EmployeeSalary) => void;
  onViewLatestPayslip?: (employee: EmployeeSalary) => void;
  onUpdateSalaryDetails?: (employee: EmployeeSalary) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  onGenerateSalarySlip, 
  onViewHistory,
  onViewLatestPayslip,
  onUpdateSalaryDetails
}) => {
  return (
    <Card key={employee.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{employee.employee.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{employee.employee.name}</h4>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
          </div>
          <Badge 
            variant={employee.status === "Paid" ? "default" : "secondary"}
            className={employee.status === "Paid" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}
          >
            {employee.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="font-medium">₹{employee.salary.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Increment</p>
            <p className="font-medium">{format(new Date(employee.lastIncrement), "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onGenerateSalarySlip(employee)}
          >
            <FileText className="h-4 w-4 mr-1" /> Salary Slip
          </Button>
          {onViewHistory && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewHistory(employee)}
            >
              <History className="h-4 w-4 mr-1" /> History
            </Button>
          )}
          {onUpdateSalaryDetails && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdateSalaryDetails(employee)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          {onViewLatestPayslip && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewLatestPayslip(employee)}
            >
              <FileText className="h-4 w-4 mr-1 text-blue-600" /> Latest
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
