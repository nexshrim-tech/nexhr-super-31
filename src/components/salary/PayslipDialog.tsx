
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EmployeeSalary } from "@/types/salary";
import SalarySlipGenerator from "./SalarySlipGenerator";

interface PayslipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeData: EmployeeSalary | null;
}

const PayslipDialog: React.FC<PayslipDialogProps> = ({ 
  open, 
  onOpenChange, 
  employeeData 
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Salary Slip</SheetTitle>
        </SheetHeader>
        {employeeData && (
          <SalarySlipGenerator 
            open={open}
            onOpenChange={onOpenChange}
            employee={employeeData} 
          />
        )}
        <SheetFooter className="mt-4">
          <Button>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PayslipDialog;
