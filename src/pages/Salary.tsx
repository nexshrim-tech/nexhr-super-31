import React, { useState, Dispatch, SetStateAction } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SalaryListSection from "@/components/salary/SalaryListSection";
import SalaryFormDialog from "@/components/salary/SalaryFormDialog";
import PayslipHistoryDialog from "@/components/salary/PayslipHistoryDialog";
import SalarySlipGenerator from "@/components/salary/SalarySlipGenerator";
import { EmployeeSalary, PayslipRecord } from "@/types/salary";

const Salary: React.FC = () => {
  // Sample employee data (replace with actual data fetching)
  const [employees, setEmployees] = useState<EmployeeSalary[]>([
    {
      id: 1,
      employee: { name: "Olivia Rhye", avatar: "OR" },
      position: "Frontend Developer",
      department: "Engineering",
      salary: 75000,
      lastIncrement: "2023-05-15",
      status: "Paid",
      allowances: {
        basicSalary: 30000,
        hra: 15000,
        conveyanceAllowance: 5000,
        medicalAllowance: 3000,
        specialAllowance: 10000,
        otherAllowances: 2000
      },
      deductions: {
        incomeTax: 6000,
        providentFund: 3000,
        professionalTax: 200,
        loanDeduction: 1000,
        otherDeductions: 500,
        esi: 0
      },
      payslipId: "PS-2023-12-1"
    },
    {
      id: 2,
      employee: { name: "Phoenix Baker", avatar: "PB" },
      position: "Backend Developer",
      department: "Engineering",
      salary: 80000,
      lastIncrement: "2023-06-20",
      status: "Unpaid",
      allowances: {
        basicSalary: 35000,
        hra: 17000,
        conveyanceAllowance: 5000,
        medicalAllowance: 3000,
        specialAllowance: 10000,
        otherAllowances: 2000
      },
      deductions: {
        incomeTax: 7000,
        providentFund: 3200,
        professionalTax: 200,
        loanDeduction: 1000,
        otherDeductions: 500,
        esi: 0
      },
      payslipId: "PS-2023-12-2"
    },
    {
      id: 3,
      employee: { name: "Lana Steiner", avatar: "LS" },
      position: "UI/UX Designer",
      department: "Design",
      salary: 65000,
      lastIncrement: "2023-07-01",
      status: "Paid",
      allowances: {
        basicSalary: 28000,
        hra: 14000,
        conveyanceAllowance: 4000,
        medicalAllowance: 2500,
        specialAllowance: 9000,
        otherAllowances: 1500
      },
      deductions: {
        incomeTax: 5000,
        providentFund: 2800,
        professionalTax: 200,
        loanDeduction: 0,
        otherDeductions: 300,
        esi: 0
      },
      payslipId: "PS-2023-12-3"
    },
  ]);
  const [salaryFormDialogOpen, setSalaryFormDialogOpen] = useState(false);
  const [payslipHistoryDialogOpen, setPayslipHistoryDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalary | null>(null);

  const handleGenerateSalarySlip = (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
  };

  const handleViewPayslip = (payslipId: string) => {
    // Implementation for viewing payslip
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Salary Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employees" className="space-y-4">
            <TabsList>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="employees">
              <div>
                <Button onClick={() => setSalaryFormDialogOpen(true)}>Add Salary Details</Button>
              </div>
            </TabsContent>
            <TabsContent value="reports">
              <div>
                {/* Reports content here */}
                <p>Salary Reports Content</p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div>
                {/* Settings content here */}
                <p>Salary Settings Content</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SalaryListSection 
        employees={employees} 
        onGenerateSalarySlip={handleGenerateSalarySlip}
      />

      <SalaryFormDialog
        open={salaryFormDialogOpen}
        onOpenChange={setSalaryFormDialogOpen}
        onClose={() => setSalaryFormDialogOpen(false)}
        onSave={() => {/* Save logic */}}
        employeeList={employees.map(emp => ({
          id: emp.id,
          name: emp.employee.name,
          department: emp.department,
          position: emp.position
        }))}
      />

      {selectedEmployee && (
        <Sheet open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Salary Slip</SheetTitle>
            </SheetHeader>
            <SalarySlipGenerator employee={selectedEmployee} />
            <SheetFooter className="mt-4">
              <Button>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      <PayslipHistoryDialog
        open={payslipHistoryDialogOpen}
        onOpenChange={setPayslipHistoryDialogOpen}
        payslips={[/* mock payslip data */]}
        onViewPayslip={handleViewPayslip}
      />
    </div>
  );
};

export default Salary;
