import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SalaryStats from "@/components/salary/SalaryStats";
import SalaryTrends from "@/components/salary/SalaryTrends";
import SalaryListSection from "@/components/salary/SalaryListSection";
import SalaryFormDialog from "@/components/salary/SalaryFormDialog";
import PayslipDialog from "@/components/salary/PayslipDialog";
import { EmployeeSalary, SalaryData } from "@/types/salary";

// Sample data
const salaryData: SalaryData[] = [
  { month: "Jan", amount: 250000 },
  { month: "Feb", amount: 255000 },
  { month: "Mar", amount: 260000 },
  { month: "Apr", amount: 270000 },
  { month: "May", amount: 275000 },
  { month: "Jun", amount: 280000 },
  { month: "Jul", amount: 285000 },
  { month: "Aug", amount: 290000 },
];

const employeeSalaries: EmployeeSalary[] = [
  {
    id: 1,
    employee: { name: "Olivia Rhye", avatar: "OR" },
    position: "UI Designer",
    department: "Design",
    salary: 75000,
    lastIncrement: "2023-01-15",
    status: "Paid",
    allowances: {
      basicSalary: 45000,
      hra: 22500,
      conveyanceAllowance: 3750,
      medicalAllowance: 3750,
      specialAllowance: 0,
      otherAllowances: 0
    },
    deductions: {
      incomeTax: 7500,
      providentFund: 3750,
      professionalTax: 200,
      loanDeduction: 0,
      otherDeductions: 0,
      esi: 750
    }
  },
  {
    id: 2,
    employee: { name: "Phoenix Baker", avatar: "PB" },
    position: "Product Manager",
    department: "Product",
    salary: 85000,
    lastIncrement: "2023-02-10",
    status: "Paid",
    allowances: {
      basicSalary: 51000,
      hra: 25500,
      conveyanceAllowance: 4250,
      medicalAllowance: 4250,
      specialAllowance: 0,
      otherAllowances: 0
    },
    deductions: {
      incomeTax: 8500,
      providentFund: 4250,
      professionalTax: 200,
      loanDeduction: 0,
      otherDeductions: 0,
      esi: 850
    }
  },
  {
    id: 3,
    employee: { name: "Lana Steiner", avatar: "LS" },
    position: "Frontend Developer",
    department: "Engineering",
    salary: 80000,
    lastIncrement: "2023-03-20",
    status: "Paid",
    allowances: {
      basicSalary: 48000,
      hra: 24000,
      conveyanceAllowance: 4000,
      medicalAllowance: 4000,
      specialAllowance: 0,
      otherAllowances: 0
    },
    deductions: {
      incomeTax: 8000,
      providentFund: 4000,
      professionalTax: 200,
      loanDeduction: 0,
      otherDeductions: 0,
      esi: 800
    }
  },
  {
    id: 4,
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    position: "Backend Developer",
    department: "Engineering",
    salary: 82000,
    lastIncrement: "2023-02-15",
    status: "Pending",
    allowances: {
      basicSalary: 49200,
      hra: 24600,
      conveyanceAllowance: 4100,
      medicalAllowance: 4100,
      specialAllowance: 0,
      otherAllowances: 0
    },
    deductions: {
      incomeTax: 8200,
      providentFund: 4100,
      professionalTax: 200,
      loanDeduction: 0,
      otherDeductions: 0,
      esi: 820
    }
  },
  {
    id: 5,
    employee: { name: "Candice Wu", avatar: "CW" },
    position: "Full Stack Developer",
    department: "Engineering",
    salary: 90000,
    lastIncrement: "2023-01-05",
    status: "Paid",
    allowances: {
      basicSalary: 54000,
      hra: 27000,
      conveyanceAllowance: 4500,
      medicalAllowance: 4500,
      specialAllowance: 0,
      otherAllowances: 0
    },
    deductions: {
      incomeTax: 9000,
      providentFund: 4500,
      professionalTax: 200,
      loanDeduction: 0,
      otherDeductions: 0,
      esi: 900
    }
  },
];

const Salary = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSalarySlip, setOpenSalarySlip] = useState(false);
  const [selectedSalaryData, setSelectedSalaryData] = useState<EmployeeSalary | null>(null);
  const { toast } = useToast();

  const handleGenerateSalarySlip = (employeeData: EmployeeSalary) => {
    setSelectedSalaryData(employeeData);
    setOpenSalarySlip(true);
  };

  const handleAddSalary = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSalarySave = (formData: any) => {
    toast({
      title: "Salary details updated",
      description: "The salary details have been successfully updated.",
    });
    setOpenDialog(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Salary Management</h1>
            <Button onClick={handleAddSalary}>
              <Plus className="mr-2 h-4 w-4" /> Add Salary
            </Button>
          </div>

          <SalaryStats />
          <SalaryTrends data={salaryData} />
          <SalaryListSection 
            employees={employeeSalaries} 
            onGenerateSalarySlip={handleGenerateSalarySlip} 
          />
        </div>
      </div>

      <SalaryFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onClose={handleCloseDialog}
        onSave={handleSalarySave}
      />

      <PayslipDialog
        open={openSalarySlip}
        onOpenChange={setOpenSalarySlip}
        employeeData={selectedSalaryData}
      />
    </div>
  );
};

export default Salary;
