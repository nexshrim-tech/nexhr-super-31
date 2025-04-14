
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SalarySlipGeneratorProps } from "@/types/components";

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({ 
  open, 
  onOpenChange, 
  employee 
}) => {
  if (!employee) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Salary Slip</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 bg-white p-6 border rounded-lg">
          <div className="flex justify-between border-b pb-4 mb-4">
            <div>
              <h3 className="font-bold text-lg">{employee.employee.name}</h3>
              <p className="text-gray-500">{employee.position}</p>
              <p className="text-gray-500">{employee.department}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Pay Period</p>
              <p>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="font-semibold mb-2">Earnings</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span>₹{employee.allowances.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA</span>
                  <span>₹{employee.allowances.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conveyance Allowance</span>
                  <span>₹{employee.allowances.conveyanceAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Allowance</span>
                  <span>₹{employee.allowances.medicalAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance</span>
                  <span>₹{employee.allowances.specialAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Allowances</span>
                  <span>₹{employee.allowances.otherAllowances.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Deductions</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Income Tax</span>
                  <span>₹{employee.deductions.incomeTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provident Fund</span>
                  <span>₹{employee.deductions.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span>₹{employee.deductions.professionalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ESI</span>
                  <span>₹{employee.deductions.esi.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Deduction</span>
                  <span>₹{employee.deductions.loanDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Deductions</span>
                  <span>₹{employee.deductions.otherDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Net Salary</span>
              <span>₹{employee.salary.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SalarySlipGenerator;
