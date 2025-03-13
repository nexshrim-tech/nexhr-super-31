
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

// Sample employee salary data with allowances and deductions
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

// Sample payslip history data
const payslipHistory = [
  { id: "PS-2023-08", employee: "Olivia Rhye", period: "August 2023", amount: 6250, date: "2023-08-31" },
  { id: "PS-2023-07", employee: "Olivia Rhye", period: "July 2023", amount: 6250, date: "2023-07-31" },
  { id: "PS-2023-06", employee: "Olivia Rhye", period: "June 2023", amount: 6250, date: "2023-06-30" },
  { id: "PS-2023-05", employee: "Olivia Rhye", period: "May 2023", amount: 6000, date: "2023-05-31" },
];

const Salary = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRunPayrollDialog, setShowRunPayrollDialog] = useState(false);
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showPayslipHistory, setShowPayslipHistory] = useState(false);
  const [editSalaryDialog, setEditSalaryDialog] = useState(false);
  const [editSalaryDetailsDialog, setEditSalaryDetailsDialog] = useState(false);
  const [editSalaryData, setEditSalaryData] = useState({
    salary: "",
    effectiveDate: ""
  });
  const { toast } = useToast();

  const filteredEmployees = employeeSalaries.filter((employee) => {
    const matchesDepartment = selectedDepartment === "all" || employee.department.toLowerCase() === selectedDepartment.toLowerCase();
    const matchesSearch = employee.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const handleRunPayroll = (formData: any) => {
    // In a real application, this would process the payroll
    toast({
      title: "Payroll Processed Successfully",
      description: `Payroll for ${formData.payPeriod} has been processed and scheduled for payment on ${formData.paymentDate}.`,
    });
    setShowRunPayrollDialog(false);
  };

  const handleViewPayslip = (employee: any) => {
    setSelectedEmployee(employee);
    setShowPayslipDialog(true);
  };

  const handleViewProfile = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEmployeeProfile(true);
  };

  const handleEditSalary = (employee: any) => {
    setSelectedEmployee(employee);
    setEditSalaryData({
      salary: employee.salary.toString(),
      effectiveDate: format(new Date(), 'yyyy-MM-dd')
    });
    setEditSalaryDialog(true);
  };

  const handleEditSalaryDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setEditSalaryDetailsDialog(true);
  };

  const handleUpdateSalary = () => {
    if (!selectedEmployee) return;
    
    const updatedSalaries = employeeSalaries.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          salary: parseFloat(editSalaryData.salary),
          lastIncrement: editSalaryData.effectiveDate
        };
      }
      return emp;
    });
    
    // This is just for demo. In a real app, you'd update the state and database
    toast({
      title: "Salary Updated",
      description: `${selectedEmployee.employee.name}'s salary has been updated to $${parseFloat(editSalaryData.salary).toLocaleString()}.`,
    });
    
    setEditSalaryDialog(false);
  };

  const handleSaveSalaryDetails = (allowances: any, deductions: any) => {
    if (!selectedEmployee) return;
    
    // In a real app, you would save these to a database
    console.log("Updated salary details:", { allowances, deductions });
    
    // Update the selected employee with new allowances and deductions
    const updatedEmployee = {
      ...selectedEmployee,
      allowances,
      deductions
    };
    
    setSelectedEmployee(updatedEmployee);
  };

  const handleViewPayslipHistory = () => {
    if (selectedEmployee) {
      setShowPayslipHistory(true);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Salary data is being exported to CSV. It will be downloaded shortly.",
    });
    // In a real app, this would trigger a file download
  };

  // Calculate total earnings and deductions
  const calculateNetPay = (employee: any) => {
    if (!employee || !employee.allowances || !employee.deductions) return { 
      totalEarnings: employee?.salary ? employee.salary / 12 : 0, 
      totalDeductions: employee?.salary ? (employee.salary / 12) * 0.2 : 0,
      netPay: employee?.salary ? (employee.salary / 12) * 0.8 : 0
    };
    
    // Convert all values to numbers before arithmetic operations
    const totalEarnings = Object.entries(employee.allowances).reduce((sum: number, [key, val]: [string, any]) => {
      return sum + (typeof val === 'number' ? val : parseFloat(val) || 0);
    }, 0);
    
    const totalDeductions = Object.entries(employee.deductions).reduce((sum: number, [key, val]: [string, any]) => {
      return sum + (typeof val === 'number' ? val : parseFloat(val) || 0);
    }, 0);
    
    return {
      totalEarnings: totalEarnings / 12,
      totalDeductions: totalDeductions / 12,
      netPay: (totalEarnings - totalDeductions) / 12
    };
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Salary Management</h1>
              <p className="text-gray-500">Manage and track employee salaries</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => setShowRunPayrollDialog(true)}>Run Payroll</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Monthly Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$290,000</div>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600">↑ 3.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$82,400</div>
                <p className="text-sm text-gray-500">Across all departments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$10,000</div>
                <p className="text-sm text-gray-500">2 employees</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payroll Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salaryData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3944BC"
                        fill="#3944BC"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Employee Salaries</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search employees..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Annual Salary</TableHead>
                      <TableHead>Last Increment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{item.employee.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{item.employee.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>${item.salary.toLocaleString()}</TableCell>
                        <TableCell>{item.lastIncrement}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              item.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSalary(item)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSalaryDetails(item)}
                            >
                              Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewProfile(item)}
                            >
                              Profile
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPayslip(item)}
                            >
                              Payslip
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Run Payroll Dialog */}
      <Dialog open={showRunPayrollDialog} onOpenChange={setShowRunPayrollDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
            <DialogDescription>
              Process payroll for all employees. This will calculate salaries, taxes, and deductions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              payPeriod: formData.get('payPeriod') as string,
              paymentDate: formData.get('paymentDate') as string,
              notes: formData.get('notes') as string,
            };
            handleRunPayroll(data);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payPeriod" className="text-right">
                  Pay Period
                </Label>
                <select
                  id="payPeriod"
                  name="payPeriod"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="August 2023">August 2023</option>
                  <option value="September 2023">September 2023</option>
                  <option value="October 2023">October 2023</option>
                  <option value="November 2023">November 2023</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentDate" className="text-right">
                  Payment Date
                </Label>
                <Input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  className="col-span-3"
                  placeholder="Optional notes for this payroll run"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Process Payroll</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payslip Dialog */}
      <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Employee Payslip</DialogTitle>
            <DialogDescription>
              Detailed breakdown of employee's salary for the current period
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4">
              <div className="border-b pb-4 mb-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{selectedEmployee.employee.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedEmployee.employee.name}</h3>
                      <p className="text-sm text-gray-500">{selectedEmployee.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4 flex-wrap justify-end">
                      <div>
                        <p className="text-sm font-medium">Pay Period</p>
                        <p className="text-sm text-gray-500">August 1-31, 2023</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payslip ID</p>
                        <p className="text-sm text-gray-500">PS-2023-08-{selectedEmployee.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Generation Date</p>
                        <p className="text-sm text-gray-500">{format(new Date(), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Earnings</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => handleEditSalaryDetails(selectedEmployee)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Basic Salary</span>
                      <span className="text-sm">${(selectedEmployee.allowances?.basicSalary / 12).toFixed(2) || (selectedEmployee.salary * 0.5 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HRA</span>
                      <span className="text-sm">${(selectedEmployee.allowances?.hra / 12).toFixed(2) || (selectedEmployee.salary * 0.25 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conveyance Allowance</span>
                      <span className="text-sm">${(selectedEmployee.allowances?.conveyanceAllowance / 12).toFixed(2) || (selectedEmployee.salary * 0.05 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medical Allowance</span>
                      <span className="text-sm">${(selectedEmployee.allowances?.medicalAllowance / 12).toFixed(2) || (selectedEmployee.salary * 0.05 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Special Allowance</span>
                      <span className="text-sm">${(selectedEmployee.allowances?.specialAllowance / 12).toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Other Allowances</span>
                      <span className="text-sm">${(selectedEmployee.allowances?.otherAllowances / 12).toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Income Tax</span>
                      <span className="text-sm">-${(selectedEmployee.deductions?.incomeTax / 12).toFixed(2) || (selectedEmployee.salary * 0.1 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">PF Employee</span>
                      <span className="text-sm">-${(selectedEmployee.deductions?.providentFund / 12).toFixed(2) || (selectedEmployee.salary * 0.05 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Professional Tax</span>
                      <span className="text-sm">-${(selectedEmployee.deductions?.professionalTax / 12).toFixed(2) || "16.67"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ESI Employee</span>
                      <span className="text-sm">-${(selectedEmployee.deductions?.esi / 12).toFixed(2) || (selectedEmployee.salary * 0.01 / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Loan Deduction</span>
                      <span className="text-sm">-${(selectedEmployee.deductions?.loanDeduction / 12).toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Other Deductions</span>
                      <span className="text-sm">-${(selectedEmployee.deductions?.otherDeductions / 12).toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Net Pay</span>
                  <span className="font-semibold">
                    ${calculateNetPay(selectedEmployee).netPay.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-between mt-6 gap-2">
                <Button variant="outline" onClick={handleViewPayslipHistory}>
                  View Payslip History
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payslip History Dialog */}
      <Dialog open={showPayslipHistory} onOpenChange={setShowPayslipHistory}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Payslip History</DialogTitle>
            <DialogDescription>
              View past payslips for {selectedEmployee?.employee.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payslip ID</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslipHistory.map((slip) => (
                    <TableRow key={slip.id}>
                      <TableCell className="font-medium">{slip.id}</TableCell>
                      <TableCell>{slip.period}</TableCell>
                      <TableCell>${slip.amount.toFixed(2)}</TableCell>
                      <TableCell>{slip.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Salary Dialog */}
      <Dialog open={editSalaryDialog} onOpenChange={setEditSalaryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Salary</DialogTitle>
            <DialogDescription>
              Update salary information for {selectedEmployee?.employee.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentSalary" className="text-right">
                Current Salary
              </Label>
              <div className="col-span-3 flex h-10 items-center">
                ${selectedEmployee?.salary.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newSalary" className="text-right">
                New Salary
              </Label>
              <Input
                id="newSalary"
                type="number"
                value={editSalaryData.salary}
                onChange={(e) => setEditSalaryData({...editSalaryData, salary: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="effectiveDate" className="text-right">
                Effective Date
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={editSalaryData.effectiveDate}
                onChange={(e) => setEditSalaryData({...editSalaryData, effectiveDate: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <select
                id="reason"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="promotion">Promotion</option>
                <option value="annual-increment">Annual Increment</option>
                <option value="performance">Performance Based</option>
                <option value="market-adjustment">Market Adjustment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSalaryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSalary}>
              Update Salary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Salary Components Dialog */}
      {selectedEmployee && (
        <SalaryDetailsForm 
          isOpen={editSalaryDetailsDialog}
          onClose={() => setEditSalaryDetailsDialog(false)}
          employeeName={selectedEmployee.employee.name}
          initialSalary={selectedEmployee.salary}
          initialAllowances={selectedEmployee.allowances}
          initialDeductions={selectedEmployee.deductions}
          onSave={handleSaveSalaryDetails}
        />
      )}

      {/* Employee Profile Dialog */}
      <Sheet open={showEmployeeProfile} onOpenChange={setShowEmployeeProfile}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg">
          <SheetHeader>
            <SheetTitle>Employee Profile</SheetTitle>
          </SheetHeader>
          {selectedEmployee && (
            <div className="py-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">{selectedEmployee.employee.avatar}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{selectedEmployee.employee.name}</h2>
                <p className="text-gray-500">{selectedEmployee.position}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedEmployee.employee.name.toLowerCase().replace(' ', '.')}@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">EMP-{1000 + selectedEmployee.id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Salary Information</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 gap-1"
                        onClick={() => handleEditSalary(selectedEmployee)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit Base
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 gap-1"
                        onClick={() => handleEditSalaryDetails(selectedEmployee)}
                      >
                        <DollarSign className="h-3 w-3" />
                        Edit Components
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Basic Salary</p>
                      <p className="font-medium">${selectedEmployee.salary.toLocaleString()}/year</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Increment</p>
                      <p className="font-medium">{selectedEmployee.lastIncrement}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <Badge
                        className={`${
                          selectedEmployee.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedEmployee.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Salary</p>
                      <p className="font-medium">${(selectedEmployee.salary / 12).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Salary Breakdown</h3>
                  <div className="border rounded-md p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Allowances</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Basic: ${(selectedEmployee.allowances?.basicSalary / 12).toFixed(2) || (selectedEmployee.salary * 0.5 / 12).toFixed(2)}</div>
                        <div>HRA: ${(selectedEmployee.allowances?.hra / 12).toFixed(2) || (selectedEmployee.salary * 0.25 / 12).toFixed(2)}</div>
                        <div>Conveyance: ${(selectedEmployee.allowances?.conveyanceAllowance / 12).toFixed(2) || (selectedEmployee.salary * 0.05 / 12).toFixed(2)}</div>
                        <div>Medical: ${(selectedEmployee.allowances?.medicalAllowance / 12).toFixed(2) || (selectedEmployee.salary * 0.05 / 12).toFixed(2)}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Deductions</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Income Tax: ${(selectedEmployee.deductions?.incomeTax / 12).toFixed(2) || (selectedEmployee.salary * 0.1 / 12).toFixed(2)}</div>
                        <div>PF: ${(selectedEmployee.deductions?.providentFund / 12).toFixed(2) || (selectedEmployee.salary * 0.05 / 12).toFixed(2)}</div>
                        <div>Prof Tax: ${(selectedEmployee.deductions?.professionalTax / 12).toFixed(2) || "16.67"}</div>
                        <div>ESI: ${(selectedEmployee.deductions?.esi / 12).toFixed(2) || (selectedEmployee.salary * 0.01 / 12).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Net Monthly Salary:</span>
                        <span>${calculateNetPay(selectedEmployee).netPay.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Employment History</h3>
                  <div className="space-y-3">
                    <div className="border-l-2 border-gray-200 pl-4 py-1">
                      <p className="font-medium">{selectedEmployee.position}</p>
                      <p className="text-sm text-gray-500">Jan 2022 - Present</p>
                    </div>
                    <div className="border-l-2 border-gray-200 pl-4 py-1">
                      <p className="font-medium">Junior {selectedEmployee.position}</p>
                      <p className="text-sm text-gray-500">Jan 2020 - Dec 2021</p>
                    </div>
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewPayslip(selectedEmployee)}
                >
                  View Payslip
                </Button>
                <Button onClick={() => handleEditSalaryDetails(selectedEmployee)}>
                  Manage Salary Components
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Salary;
