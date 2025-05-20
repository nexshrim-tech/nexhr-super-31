
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployeeSalary } from "@/types/salary";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface PayslipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeData: EmployeeSalary | null;
  onGeneratePayslip?: () => Promise<void>;
}

const PayslipDialog: React.FC<PayslipDialogProps> = ({
  open,
  onOpenChange,
  employeeData,
  onGeneratePayslip
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!employeeData) return null;

  const totalAllowances = Object.values(employeeData.allowances).reduce((sum, value) => sum + Number(value), 0);
  const totalDeductions = Object.values(employeeData.deductions).reduce((sum, value) => sum + Number(value), 0);
  const netSalary = totalAllowances - totalDeductions;

  const handleGeneratePayslip = async () => {
    if (!employeeData) return;
    
    try {
      setLoading(true);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      // Insert new payslip record with proper type conversion
      const { data, error } = await supabase
        .from('payslip')
        .insert({
          employeeid: parseInt(employeeData.id) || 0, // Convert string to number
          year: year,
          month: month,
          amount: netSalary,
          generatedtimestamp: now.toISOString()
        })
        .select();
      
      if (error) {
        console.error('Error generating payslip:', error);
        toast({
          title: "Error",
          description: "Failed to generate payslip",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success",
        description: `Payslip generated for ${employeeData.employee.name}`,
      });
      
      // If an external handler is provided, call it
      if (onGeneratePayslip) {
        await onGeneratePayslip();
      }
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPayslip = () => {
    if (!employeeData) return;
    
    // Generate a simple text version of the payslip
    const payslipText = `
Payslip for ${employeeData.employee.name}
Position: ${employeeData.position}
Department: ${employeeData.department}
Period: ${format(new Date(), "MMMM yyyy")}

ALLOWANCES
Basic Salary: ₹${employeeData.allowances.basicSalary.toFixed(2)}
HRA: ₹${employeeData.allowances.hra.toFixed(2)}
Conveyance Allowance: ₹${employeeData.allowances.conveyanceAllowance.toFixed(2)}
Medical Allowance: ₹${employeeData.allowances.medicalAllowance.toFixed(2)}
Special Allowance: ₹${employeeData.allowances.specialAllowance.toFixed(2)}
Other Allowances: ₹${employeeData.allowances.otherAllowances.toFixed(2)}
Total Allowances: ₹${totalAllowances.toFixed(2)}

DEDUCTIONS
Income Tax: ₹${employeeData.deductions.incomeTax.toFixed(2)}
Provident Fund: ₹${employeeData.deductions.providentFund.toFixed(2)}
Professional Tax: ₹${employeeData.deductions.professionalTax.toFixed(2)}
ESI: ₹${employeeData.deductions.esi.toFixed(2)}
Loan Deduction: ₹${employeeData.deductions.loanDeduction.toFixed(2)}
Other Deductions: ₹${employeeData.deductions.otherDeductions.toFixed(2)}
Total Deductions: ₹${totalDeductions.toFixed(2)}

NET SALARY: ₹${netSalary.toFixed(2)}

Generated on ${format(new Date(), "dd/MM/yyyy")}
    `.trim();

    // Create a blob and download it
    const blob = new Blob([payslipText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `payslip_${employeeData.employee.name.replace(/\s+/g, '_').toLowerCase()}_${format(new Date(), 'MMM_yyyy')}.txt`);
    
    toast({
      title: "Success",
      description: "Payslip downloaded successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Salary Slip</DialogTitle>
          <DialogDescription>
            Payslip details for {employeeData.employee.name} for {format(new Date(), "MMMM yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-6 my-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold">{employeeData.employee.name}</h2>
              <p className="text-gray-500">{employeeData.position}</p>
              <p className="text-gray-500">{employeeData.department}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Period: {format(new Date(), "MMMM yyyy")}</p>
              <p className="text-gray-500">Generated: {format(new Date(), "dd/MM/yyyy")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Allowances</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Basic Salary</td>
                    <td className="py-2 text-right">₹{employeeData.allowances.basicSalary.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">HRA</td>
                    <td className="py-2 text-right">₹{employeeData.allowances.hra.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Conveyance Allowance</td>
                    <td className="py-2 text-right">₹{employeeData.allowances.conveyanceAllowance.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Medical Allowance</td>
                    <td className="py-2 text-right">₹{employeeData.allowances.medicalAllowance.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Special Allowance</td>
                    <td className="py-2 text-right">₹{employeeData.allowances.specialAllowance.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Other Allowances</td>
                    <td className="py-2 text-right">₹{employeeData.allowances.otherAllowances.toLocaleString()}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2">Total Allowances</td>
                    <td className="py-2 text-right">₹{totalAllowances.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Deductions</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Income Tax</td>
                    <td className="py-2 text-right">₹{employeeData.deductions.incomeTax.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">PF Employee</td>
                    <td className="py-2 text-right">₹{employeeData.deductions.providentFund.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Professional Tax</td>
                    <td className="py-2 text-right">₹{employeeData.deductions.professionalTax.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">ESI Employee</td>
                    <td className="py-2 text-right">₹{employeeData.deductions.esi.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Loan Deduction</td>
                    <td className="py-2 text-right">₹{employeeData.deductions.loanDeduction.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Other Deductions</td>
                    <td className="py-2 text-right">₹{employeeData.deductions.otherDeductions.toLocaleString()}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2">Total Deductions</td>
                    <td className="py-2 text-right">₹{totalDeductions.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Net Salary</h3>
              <p className="text-xl font-bold">₹{netSalary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownloadPayslip}
          >
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button 
            onClick={handleGeneratePayslip}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate & Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipDialog;
