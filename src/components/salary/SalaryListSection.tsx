
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, History } from "lucide-react";
import { EmployeeSalary, PayslipRecord } from "@/types/salary";
import EmployeeTable from "./EmployeeTable";
import EmployeeCard from "./EmployeeCard";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PayslipHistory from "./PayslipHistory";

interface SalaryListSectionProps {
  employees: EmployeeSalary[];
  onGenerateSalarySlip: (employee: EmployeeSalary) => void;
}

const SalaryListSection: React.FC<SalaryListSectionProps> = ({ employees, onGenerateSalarySlip }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalary | null>(null);
  
  // Sample payslip history data - in a real app this would come from an API
  const samplePayslipHistory: PayslipRecord[] = [
    { id: "PS-2023-08", employee: "Olivia Rhye", period: "August 2023", amount: 6250, date: "2023-08-31" },
    { id: "PS-2023-07", employee: "Olivia Rhye", period: "July 2023", amount: 6250, date: "2023-07-31" },
    { id: "PS-2023-06", employee: "Olivia Rhye", period: "June 2023", amount: 6250, date: "2023-06-30" },
    { id: "PS-2023-05", employee: "Olivia Rhye", period: "May 2023", amount: 6000, date: "2023-05-31" },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewHistory = (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
    setOpenHistory(true);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>Employee Salaries</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table View</SelectItem>
                  <SelectItem value="card">Card View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <EmployeeTable 
              employees={filteredEmployees} 
              onGenerateSalarySlip={onGenerateSalarySlip}
              onViewHistory={handleViewHistory}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <EmployeeCard 
                  key={employee.id}
                  employee={employee} 
                  onGenerateSalarySlip={onGenerateSalarySlip}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openHistory} onOpenChange={setOpenHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee ? `Payslip History - ${selectedEmployee.employee.name}` : "Payslip History"}
            </DialogTitle>
          </DialogHeader>
          <PayslipHistory 
            payslips={samplePayslipHistory} 
            onViewPayslip={(id) => {
              // Here we would fetch the specific payslip data and show it
              console.log("View payslip:", id);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SalaryListSection;
