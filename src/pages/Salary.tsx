
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Plus, Search, User } from "lucide-react";
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
  },
  {
    id: 2,
    employee: { name: "Phoenix Baker", avatar: "PB" },
    position: "Product Manager",
    department: "Product",
    salary: 85000,
    lastIncrement: "2023-02-10",
    status: "Paid",
  },
  {
    id: 3,
    employee: { name: "Lana Steiner", avatar: "LS" },
    position: "Frontend Developer",
    department: "Engineering",
    salary: 80000,
    lastIncrement: "2023-03-20",
    status: "Paid",
  },
  {
    id: 4,
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    position: "Backend Developer",
    department: "Engineering",
    salary: 82000,
    lastIncrement: "2023-02-15",
    status: "Pending",
  },
  {
    id: 5,
    employee: { name: "Candice Wu", avatar: "CW" },
    position: "Full Stack Developer",
    department: "Engineering",
    salary: 90000,
    lastIncrement: "2023-01-05",
    status: "Paid",
  },
];

const Salary = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRunPayrollDialog, setShowRunPayrollDialog] = useState(false);
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
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
    // Open edit dialog or implement inline editing logic
    toast({
      title: "Edit Salary",
      description: `You can now edit ${employee.employee.name}'s salary details.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Salary data is being exported to CSV. It will be downloaded shortly.",
    });
    // In a real app, this would trigger a file download
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
                              <AvatarImage src="" alt={item.employee.name} />
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
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4">
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
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
                    <p className="text-sm font-medium">Pay Period</p>
                    <p className="text-sm text-gray-500">August 1-31, 2023</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-2">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Basic Salary</span>
                      <span className="text-sm">${(selectedEmployee.salary / 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bonus</span>
                      <span className="text-sm">$1,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Overtime</span>
                      <span className="text-sm">$500.00</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Tax</span>
                      <span className="text-sm">-$1,200.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Insurance</span>
                      <span className="text-sm">-$300.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retirement</span>
                      <span className="text-sm">-$500.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Net Pay</span>
                  <span className="font-semibold">
                    ${((selectedEmployee.salary / 12) + 1500 - 2000).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-2">
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
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Profile Dialog */}
      <Sheet open={showEmployeeProfile} onOpenChange={setShowEmployeeProfile}>
        <SheetContent className="w-[400px] sm:w-[540px]">
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
                  <div className="grid grid-cols-2 gap-4">
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
                  <h3 className="text-lg font-medium mb-2">Salary Information</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                  onClick={() => handleEditSalary(selectedEmployee)}
                >
                  Edit Salary
                </Button>
                <Button onClick={() => handleViewPayslip(selectedEmployee)}>
                  View Payslip
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
