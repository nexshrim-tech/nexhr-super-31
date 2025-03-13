
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SalaryAllowances {
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
}

interface SalaryDeductions {
  incomeTax: number;
  providentFund: number;
  professionalTax: number;
  loanDeduction: number;
  otherDeductions: number;
  esi: number;
}

interface SalaryDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  initialSalary: number;
  onSave: (allowances: SalaryAllowances, deductions: SalaryDeductions) => void;
  initialAllowances?: Partial<SalaryAllowances>;
  initialDeductions?: Partial<SalaryDeductions>;
}

const SalaryDetailsForm = ({
  isOpen,
  onClose,
  employeeName,
  initialSalary,
  onSave,
  initialAllowances = {},
  initialDeductions = {},
}: SalaryDetailsFormProps) => {
  // Default values for salary components (using the initialSalary to calculate defaults)
  const defaultAllowances: SalaryAllowances = {
    basicSalary: initialSalary * 0.6,
    hra: initialSalary * 0.3,
    conveyanceAllowance: initialSalary * 0.05,
    medicalAllowance: initialSalary * 0.05,
    specialAllowance: 0,
    otherAllowances: 0,
  };

  const defaultDeductions: SalaryDeductions = {
    incomeTax: initialSalary * 0.1,
    providentFund: initialSalary * 0.05,
    professionalTax: 200,
    loanDeduction: 0,
    otherDeductions: 0,
    esi: initialSalary * 0.01,
  };

  // State for form data
  const [allowances, setAllowances] = useState<SalaryAllowances>({
    ...defaultAllowances,
    ...initialAllowances,
  });

  const [deductions, setDeductions] = useState<SalaryDeductions>({
    ...defaultDeductions,
    ...initialDeductions,
  });

  const { toast } = useToast();

  const handleAllowanceChange = (key: keyof SalaryAllowances, value: string) => {
    setAllowances({
      ...allowances,
      [key]: parseFloat(value) || 0,
    });
  };

  const handleDeductionChange = (key: keyof SalaryDeductions, value: string) => {
    setDeductions({
      ...deductions,
      [key]: parseFloat(value) || 0,
    });
  };

  const handleSave = () => {
    onSave(allowances, deductions);
    toast({
      title: "Salary details updated",
      description: `Salary details for ${employeeName} have been updated successfully.`,
    });
    onClose();
  };

  // Calculate totals
  const totalAllowances = Object.values(allowances).reduce((sum, value) => sum + value, 0);
  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);
  const netSalary = totalAllowances - totalDeductions;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Salary Components</DialogTitle>
          <DialogDescription>
            Update salary allowances and deductions for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Allowances</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={allowances.basicSalary}
                  onChange={(e) => handleAllowanceChange("basicSalary", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hra">HRA</Label>
                <Input
                  id="hra"
                  type="number"
                  value={allowances.hra}
                  onChange={(e) => handleAllowanceChange("hra", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="conveyanceAllowance">Conveyance Allowance</Label>
                <Input
                  id="conveyanceAllowance"
                  type="number"
                  value={allowances.conveyanceAllowance}
                  onChange={(e) => handleAllowanceChange("conveyanceAllowance", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                <Input
                  id="medicalAllowance"
                  type="number"
                  value={allowances.medicalAllowance}
                  onChange={(e) => handleAllowanceChange("medicalAllowance", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="specialAllowance">Special Allowance</Label>
                <Input
                  id="specialAllowance"
                  type="number"
                  value={allowances.specialAllowance}
                  onChange={(e) => handleAllowanceChange("specialAllowance", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="otherAllowances">Other Allowances</Label>
                <Input
                  id="otherAllowances"
                  type="number"
                  value={allowances.otherAllowances}
                  onChange={(e) => handleAllowanceChange("otherAllowances", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Deductions</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="incomeTax">Income Tax</Label>
                <Input
                  id="incomeTax"
                  type="number"
                  value={deductions.incomeTax}
                  onChange={(e) => handleDeductionChange("incomeTax", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="providentFund">PF Employee</Label>
                <Input
                  id="providentFund"
                  type="number"
                  value={deductions.providentFund}
                  onChange={(e) => handleDeductionChange("providentFund", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="professionalTax">Professional Tax</Label>
                <Input
                  id="professionalTax"
                  type="number"
                  value={deductions.professionalTax}
                  onChange={(e) => handleDeductionChange("professionalTax", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="esi">ESI Employee</Label>
                <Input
                  id="esi"
                  type="number"
                  value={deductions.esi}
                  onChange={(e) => handleDeductionChange("esi", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="loanDeduction">Loan Deduction</Label>
                <Input
                  id="loanDeduction"
                  type="number"
                  value={deductions.loanDeduction}
                  onChange={(e) => handleDeductionChange("loanDeduction", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="otherDeductions">Other Deductions</Label>
                <Input
                  id="otherDeductions"
                  type="number"
                  value={deductions.otherDeductions}
                  onChange={(e) => handleDeductionChange("otherDeductions", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Allowances:</span>
              <span className="float-right">${totalAllowances.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium">Total Deductions:</span>
              <span className="float-right">${totalDeductions.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium">Net Salary:</span>
              <span className="float-right">${netSalary.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryDetailsForm;
