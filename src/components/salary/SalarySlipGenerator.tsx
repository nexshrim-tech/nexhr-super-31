
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Hash, Calendar, FileDown, Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployeeSalary, SalaryAllowances, SalaryDeductions } from "@/types/salary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface SalarySlipGeneratorProps {
  employeeData: EmployeeSalary;
}

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({ employeeData }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [payslipId, setPayslipId] = useState<string>(employeeData.payslipId || "");
  const { toast } = useToast();
  
  // Create a state to hold editable allowances and deductions
  const [allowances, setAllowances] = useState<SalaryAllowances>({...employeeData.allowances});
  const [deductions, setDeductions] = useState<SalaryDeductions>({...employeeData.deductions});

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

  // Generate a payslip ID when month and year are selected
  useEffect(() => {
    if (selectedMonth && selectedYear && !payslipId) {
      const newPayslipId = `PS-${selectedYear}-${months.indexOf(selectedMonth) + 1}-${employeeData.id}`;
      setPayslipId(newPayslipId);
    }
  }, [selectedMonth, selectedYear, employeeData.id, payslipId]);

  const generatePayslip = () => {
    setIsPreviewDialogOpen(true);
  };

  const downloadAsPDF = () => {
    toast({
      title: "Download started",
      description: "Your salary slip is being downloaded as PDF.",
    });
    
    // In a real application, this would convert to PDF and trigger download
    setTimeout(() => {
      setIsPreviewDialogOpen(false);
    }, 1000);
  };

  const handleAllowanceChange = (key: keyof SalaryAllowances, value: string) => {
    setAllowances(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleDeductionChange = (key: keyof SalaryDeductions, value: string) => {
    setDeductions(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const saveChanges = () => {
    toast({
      title: "Changes saved",
      description: "The payslip details have been updated successfully.",
    });
    setIsEditMode(false);
  };

  // Calculate totals
  const calculateTotals = () => {
    const grossPay = allowances.basicSalary + allowances.hra + allowances.conveyanceAllowance + 
                     allowances.medicalAllowance + allowances.specialAllowance + allowances.otherAllowances;
                     
    const totalDeductions = deductions.incomeTax + deductions.providentFund + deductions.professionalTax + 
                           deductions.loanDeduction + deductions.otherDeductions + deductions.esi;
                           
    const netPay = grossPay - totalDeductions;
    
    return { grossPay, totalDeductions, netPay };
  };

  const { grossPay, totalDeductions, netPay } = calculateTotals();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Generate Salary Slip</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Employee Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback>
                  {employeeData.employee.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {employeeData.employee.name}
                </div>
                <div className="text-sm text-gray-500">
                  {employeeData.position} • {employeeData.department}
                </div>
              </div>
              <Badge variant={employeeData.status === "Paid" ? "default" : "secondary"} className={`ml-auto ${employeeData.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {employeeData.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payslip ID field */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Payslip ID</h3>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  const newId = `PS-${selectedYear}-${months.indexOf(selectedMonth) + 1}-${employeeData.id}-${Math.floor(Math.random() * 1000)}`;
                  setPayslipId(newId);
                  toast({
                    title: "Payslip ID generated",
                    description: `New payslip ID: ${newId}`,
                  });
                }}
                disabled={!selectedMonth || !selectedYear}
              >
                <Hash className="h-4 w-4" />
                Generate ID
              </Button>
            </div>
            <Input 
              value={payslipId} 
              onChange={(e) => setPayslipId(e.target.value)} 
              placeholder="Payslip ID will be generated"
              disabled={!isEditMode}
            />
          </div>

          {/* Allowance and Deduction Tabs */}
          <Tabs defaultValue="allowances" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="allowances">Allowances</TabsTrigger>
              <TabsTrigger value="deductions">Deductions</TabsTrigger>
            </TabsList>
            <TabsContent value="allowances" className="p-4 border rounded-lg mt-2">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="basicSalary">Basic Salary</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={allowances.basicSalary}
                    onChange={(e) => handleAllowanceChange("basicSalary", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="hra">HRA</Label>
                  <Input
                    id="hra"
                    type="number"
                    value={allowances.hra}
                    onChange={(e) => handleAllowanceChange("hra", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="conveyanceAllowance">Conveyance Allowance</Label>
                  <Input
                    id="conveyanceAllowance"
                    type="number"
                    value={allowances.conveyanceAllowance}
                    onChange={(e) => handleAllowanceChange("conveyanceAllowance", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                  <Input
                    id="medicalAllowance"
                    type="number"
                    value={allowances.medicalAllowance}
                    onChange={(e) => handleAllowanceChange("medicalAllowance", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="specialAllowance">Special Allowance</Label>
                  <Input
                    id="specialAllowance"
                    type="number"
                    value={allowances.specialAllowance}
                    onChange={(e) => handleAllowanceChange("specialAllowance", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="otherAllowances">Other Allowances</Label>
                  <Input
                    id="otherAllowances"
                    type="number"
                    value={allowances.otherAllowances}
                    onChange={(e) => handleAllowanceChange("otherAllowances", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="deductions" className="p-4 border rounded-lg mt-2">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="incomeTax">Income Tax</Label>
                  <Input
                    id="incomeTax"
                    type="number"
                    value={deductions.incomeTax}
                    onChange={(e) => handleDeductionChange("incomeTax", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="providentFund">PF Employee</Label>
                  <Input
                    id="providentFund"
                    type="number"
                    value={deductions.providentFund}
                    onChange={(e) => handleDeductionChange("providentFund", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="professionalTax">Professional Tax</Label>
                  <Input
                    id="professionalTax"
                    type="number"
                    value={deductions.professionalTax}
                    onChange={(e) => handleDeductionChange("professionalTax", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="esi">ESI Employee</Label>
                  <Input
                    id="esi"
                    type="number"
                    value={deductions.esi}
                    onChange={(e) => handleDeductionChange("esi", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="loanDeduction">Loan Deduction</Label>
                  <Input
                    id="loanDeduction"
                    type="number"
                    value={deductions.loanDeduction}
                    onChange={(e) => handleDeductionChange("loanDeduction", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  <Label htmlFor="otherDeductions">Other Deductions</Label>
                  <Input
                    id="otherDeductions"
                    type="number"
                    value={deductions.otherDeductions}
                    onChange={(e) => handleDeductionChange("otherDeductions", e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            {isEditMode ? (
              <Button 
                className="flex-1 flex items-center gap-2" 
                onClick={saveChanges}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2" 
                onClick={() => setIsEditMode(true)}
              >
                <Edit className="h-4 w-4" />
                Edit Payslip
              </Button>
            )}
            <Button 
              className="flex-1 flex items-center gap-2" 
              onClick={generatePayslip}
              disabled={!selectedMonth || !selectedYear || !payslipId}
            >
              <Calendar className="h-4 w-4" />
              Generate Salary Slip
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Salary Slip Preview</DialogTitle>
            <DialogDescription>
              Review the salary slip before downloading
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white border rounded-md p-6 max-h-[500px] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase">Salary Slip</h2>
              <p className="text-gray-600">{selectedMonth} {selectedYear}</p>
              <p className="text-sm text-gray-500 mt-1">Payslip ID: {payslipId}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Employee Name</p>
                <p className="font-medium">{employeeData.employee.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employee ID</p>
                <p>{employeeData.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Designation</p>
                <p>{employeeData.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p>{employeeData.department}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 mb-6">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span>${allowances.basicSalary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HRA</span>
                    <span>${allowances.hra.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conveyance Allowance</span>
                    <span>${allowances.conveyanceAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Allowance</span>
                    <span>${allowances.medicalAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Allowance</span>
                    <span>${allowances.specialAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Allowances</span>
                    <span>${allowances.otherAllowances.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Gross Pay</span>
                    <span>${grossPay.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Provident Fund</span>
                    <span>${deductions.providentFund.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ESI</span>
                    <span>${deductions.esi.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax</span>
                    <span>${deductions.professionalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span>${deductions.incomeTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan Deduction</span>
                    <span>${deductions.loanDeduction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Deductions</span>
                    <span>${deductions.otherDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total Deductions</span>
                    <span>${totalDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Net Salary</span>
                <span>${netPay.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-4">This is a computer-generated salary slip and does not require a signature.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={downloadAsPDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SalarySlipGenerator;
