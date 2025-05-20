
import React from "react";
import { format } from "date-fns";
import { EmployeeSalary } from "@/types/salary";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface SalarySlipGeneratorProps {
  employeeData: EmployeeSalary;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({
  employeeData,
  isOpen,
  onOpenChange,
}) => {
  if (!employeeData) return null;

  const totalAllowances = Object.values(employeeData.allowances).reduce((sum, value) => sum + Number(value), 0);
  const totalDeductions = Object.values(employeeData.deductions).reduce((sum, value) => sum + Number(value), 0);
  const netSalary = totalAllowances - totalDeductions;

  const handleDownload = () => {
    // Generate a filename using employee name and date
    const filename = `salary_slip_${employeeData.employee.name.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd")}.txt`;
    
    const content = `
SALARY SLIP
===========

Employee: ${employeeData.employee.name}
Department: ${employeeData.department}
Position: ${employeeData.position}
Period: ${format(new Date(), "MMMM yyyy")}

EARNINGS:
---------
Basic Salary: ₹${employeeData.allowances.basicSalary.toFixed(2)}
HRA: ₹${employeeData.allowances.hra.toFixed(2)}
Conveyance: ₹${employeeData.allowances.conveyanceAllowance.toFixed(2)}
Medical: ₹${employeeData.allowances.medicalAllowance.toFixed(2)}
Special: ₹${employeeData.allowances.specialAllowance.toFixed(2)}
Other: ₹${employeeData.allowances.otherAllowances.toFixed(2)}
Total Earnings: ₹${totalAllowances.toFixed(2)}

DEDUCTIONS:
-----------
Income Tax: ₹${employeeData.deductions.incomeTax.toFixed(2)}
Provident Fund: ₹${employeeData.deductions.providentFund.toFixed(2)}
Professional Tax: ₹${employeeData.deductions.professionalTax.toFixed(2)}
ESI: ₹${employeeData.deductions.esi.toFixed(2)}
Loan: ₹${employeeData.deductions.loanDeduction.toFixed(2)}
Other: ₹${employeeData.deductions.otherDeductions.toFixed(2)}
Total Deductions: ₹${totalDeductions.toFixed(2)}

NET SALARY: ₹${netSalary.toFixed(2)}

Generated on: ${format(new Date(), "dd/MM/yyyy")}
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Salary Slip</DialogTitle>
          <DialogDescription>
            Salary details for {employeeData.employee.name}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-6 border rounded-lg">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium">{employeeData.employee.name}</h3>
              <p className="text-gray-600">{employeeData.position}</p>
              <p className="text-gray-600">{employeeData.department}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-gray-600">Salary Period</p>
              <p className="font-medium">{format(new Date(), "MMMM yyyy")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 pb-1 border-b">Earnings</h4>
              <table className="w-full">
                <tbody>
                  {Object.entries(employeeData.allowances).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">
                        {key === "basicSalary"
                          ? "Basic Salary"
                          : key === "hra"
                          ? "HRA"
                          : key === "conveyanceAllowance"
                          ? "Conveyance"
                          : key === "medicalAllowance"
                          ? "Medical"
                          : key === "specialAllowance"
                          ? "Special"
                          : "Other"}
                      </td>
                      <td className="py-2 text-right">₹{value.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-2">Total Earnings</td>
                    <td className="py-2 text-right">₹{totalAllowances.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-medium mb-2 pb-1 border-b">Deductions</h4>
              <table className="w-full">
                <tbody>
                  {Object.entries(employeeData.deductions).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">
                        {key === "incomeTax"
                          ? "Income Tax"
                          : key === "providentFund"
                          ? "Provident Fund"
                          : key === "professionalTax"
                          ? "Professional Tax"
                          : key === "esi"
                          ? "ESI"
                          : key === "loanDeduction"
                          ? "Loan"
                          : "Other"}
                      </td>
                      <td className="py-2 text-right">₹{value.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-2">Total Deductions</td>
                    <td className="py-2 text-right">₹{totalDeductions.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Net Salary</h3>
              <p className="text-xl font-bold">₹{netSalary.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Slip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SalarySlipGenerator;
