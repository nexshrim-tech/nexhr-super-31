
import React, { useState, useRef } from "react";
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
import { Image, Upload, X, FileDown, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployeeSalary } from "@/types/salary";

interface SalarySlipGeneratorProps {
  employeeData: EmployeeSalary;
}

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({ employeeData }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [letterhead, setLetterhead] = useState<string | null>(null);
  const letterheadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLetterhead(event.target?.result as string);
        toast({
          title: "Letterhead uploaded",
          description: "Your letterhead has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Calculate totals
  const calculateTotals = () => {
    const allowances = employeeData.allowances;
    const deductions = employeeData.deductions;
    
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

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Company Letterhead</h3>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => letterheadInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Letterhead
              </Button>
              <input
                type="file"
                ref={letterheadInputRef}
                onChange={handleLetterheadUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            {letterhead ? (
              <div className="relative h-24 bg-white border rounded overflow-hidden mb-3">
                <img 
                  src={letterhead} 
                  alt="Company Letterhead" 
                  className="w-full h-full object-contain"
                />
                <Button 
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                  onClick={() => setLetterhead(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="h-24 bg-gray-50 border border-dashed rounded flex flex-col items-center justify-center text-gray-500 mb-3">
                <Image className="h-6 w-6 mb-1" />
                <p className="text-xs">No letterhead uploaded</p>
              </div>
            )}
          </div>

          <Button 
            className="w-full flex items-center gap-2" 
            onClick={generatePayslip}
            disabled={!selectedMonth || !selectedYear}
          >
            <Calendar className="h-4 w-4" />
            Generate Salary Slip
          </Button>
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
            {letterhead && (
              <div className="mb-6 flex justify-center">
                <img src={letterhead} alt="Letterhead" className="max-h-24 w-auto" />
              </div>
            )}
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase">Salary Slip</h2>
              <p className="text-gray-600">{selectedMonth} {selectedYear}</p>
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
                    <span>${employeeData.allowances.basicSalary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HRA</span>
                    <span>${employeeData.allowances.hra.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conveyance Allowance</span>
                    <span>${employeeData.allowances.conveyanceAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Allowance</span>
                    <span>${employeeData.allowances.medicalAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Allowance</span>
                    <span>${employeeData.allowances.specialAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Allowances</span>
                    <span>${employeeData.allowances.otherAllowances.toFixed(2)}</span>
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
                    <span>${employeeData.deductions.providentFund.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ESI</span>
                    <span>${employeeData.deductions.esi.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax</span>
                    <span>${employeeData.deductions.professionalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span>${employeeData.deductions.incomeTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan Deduction</span>
                    <span>${employeeData.deductions.loanDeduction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Deductions</span>
                    <span>${employeeData.deductions.otherDeductions.toFixed(2)}</span>
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
