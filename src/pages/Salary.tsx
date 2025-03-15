
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Plus, Search, User, Edit, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { format } from "date-fns";
import SalaryDetailsForm from "@/components/SalaryDetailsForm";
import SalarySlipGenerator from "@/components/salary/SalarySlipGenerator";

const salaryData = [
  { month: "Jan", amount: 250000 },
  { month: "Feb", amount: 255000 },
  { month: "Mar", amount: 260000 },
  { month: "Apr", amount: 270000 },
  { month: "May", amount: 275000 },
  { month: "Jun", amount: 280000 },
  { month: "Jul", amount: 285000 },
  { month: "Aug", amount: 290000 },
];

const employeeSalaries = [
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

const payslipHistory = [
  { id: "PS-2023-08", employee: "Olivia Rhye", period: "August 2023", amount: 6250, date: "2023-08-31" },
  { id: "PS-2023-07", employee: "Olivia Rhye", period: "July 2023", amount: 6250, date: "2023-07-31" },
  { id: "PS-2023-06", employee: "Olivia Rhye", period: "June 2023", amount: 6250, date: "2023-06-30" },
  { id: "PS-2023-05", employee: "Olivia Rhye", period: "May 2023", amount: 6000, date: "2023-05-31" },
];

const Salary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSalarySheet, setOpenSalarySheet] = useState(false);
  const [openSalarySlip, setOpenSalarySlip] = useState(false);
  const [selectedSalaryData, setSelectedSalaryData] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGenerateSalarySlip = (employeeData: any) => {
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

  const filteredEmployees = employeeSalaries.filter((emp) =>
    emp.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Salary Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹412,000</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹82,400</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">-5 from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Salary Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Employee Salaries</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search employees..."
                      className="pl-8 w-full md:w-[250px]"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="View Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table View</SelectItem>
                      <SelectItem value="card">Card View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Last Increment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{employee.employee.avatar}</AvatarFallback>
                              </Avatar>
                              <span>{employee.employee.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
                          <TableCell>{format(new Date(employee.lastIncrement), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge variant={employee.status === "Paid" ? "success" : "warning"}>
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleGenerateSalarySlip(employee)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((employee) => (
                    <Card key={employee.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback>{employee.employee.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{employee.employee.name}</h4>
                              <p className="text-sm text-gray-500">{employee.position}</p>
                            </div>
                          </div>
                          <Badge variant={employee.status === "Paid" ? "success" : "warning"}>
                            {employee.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="font-medium">₹{employee.salary.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{employee.department}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Increment</p>
                            <p className="font-medium">{format(new Date(employee.lastIncrement), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGenerateSalarySlip(employee)}
                          >
                            <FileText className="h-4 w-4 mr-1" /> Salary Slip
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Payslips</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payslip ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslipHistory.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell>{payslip.id}</TableCell>
                      <TableCell>{payslip.employee}</TableCell>
                      <TableCell>{payslip.period}</TableCell>
                      <TableCell>₹{payslip.amount.toLocaleString()}</TableCell>
                      <TableCell>{format(new Date(payslip.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Salary Details</DialogTitle>
            <DialogDescription>
              Enter the salary details for the employee. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <SalaryDetailsForm onSave={handleSalarySave} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            </DialogClose>
            <Button type="submit" form="salary-form">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={openSalarySlip} onOpenChange={setOpenSalarySlip}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Salary Slip</SheetTitle>
          </SheetHeader>
          {selectedSalaryData && (
            <SalarySlipGenerator employeeData={selectedSalaryData} />
          )}
          <SheetFooter className="mt-4">
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Salary;
