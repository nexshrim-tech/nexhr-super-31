
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

interface SalarySlipGeneratorProps {
  employeeData: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
    avatar: string;
    status: string;
    salary: {
      basic: number;
      hra: number;
      da: number;
      conveyance: number;
      medical: number;
      others: number;
      pf: number;
      esi: number;
      professionalTax: number;
      incomeTax: number;
      otherTax: number;
    };
  }>;
}

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({ employeeData }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
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

  const employee = employeeData.find(emp => emp.id === selectedEmployee);

  // Calculate totals if employee is selected
  const calculateTotals = () => {
    if (!employee) return { grossPay: 0, totalDeductions: 0, netPay: 0 };
    
    const salary = employee.salary;
    const grossPay = salary.basic + salary.hra + salary.da + salary.conveyance + salary.medical + salary.others;
    const totalDeductions = salary.pf + salary.esi + salary.professionalTax + salary.incomeTax + salary.otherTax;
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
          <div>
            <Label htmlFor="employee">Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employeeData.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      <span>{emp.name}</span>
                      <span className="text-gray-500 text-xs">({emp.id})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Employee Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {employee?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {employee?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee?.role} • {employee?.department}
                    </div>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800">
                    {employee?.status}
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
            </>
          )}
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
            
            {employee && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee Name</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee ID</p>
                    <p>{employee.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Designation</p>
                    <p>{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p>{employee.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 mb-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Earnings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary</span>
                        <span>${employee.salary.basic.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA</span>
                        <span>${employee.salary.hra.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dearness Allowance</span>
                        <span>${employee.salary.da.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conveyance</span>
                        <span>${employee.salary.conveyance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical</span>
                        <span>${employee.salary.medical.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Allowances</span>
                        <span>${employee.salary.others.toFixed(2)}</span>
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
                        <span>${employee.salary.pf.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESI</span>
                        <span>${employee.salary.esi.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Tax</span>
                        <span>${employee.salary.professionalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Tax</span>
                        <span>${employee.salary.incomeTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Deductions</span>
                        <span>${employee.salary.otherTax.toFixed(2)}</span>
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
              </>
            )}
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
