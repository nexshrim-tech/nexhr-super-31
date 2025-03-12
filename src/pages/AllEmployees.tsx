import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, Filter, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import TodaysAttendance from "@/components/TodaysAttendance";

const employees = [
  {
    id: "EMP001",
    name: "Olivia Rhye",
    email: "olivia@nexhr.com",
    department: "Design",
    role: "UI Designer",
    status: "Active",
    avatar: "OR",
  },
  {
    id: "EMP002",
    name: "Phoenix Baker",
    email: "phoenix@nexhr.com",
    department: "Product",
    role: "Product Manager",
    status: "Active",
    avatar: "PB",
  },
  {
    id: "EMP003",
    name: "Lana Steiner",
    email: "lana@nexhr.com",
    department: "Engineering",
    role: "Frontend Developer",
    status: "On Leave",
    avatar: "LS",
  },
  {
    id: "EMP004",
    name: "Demi Wilkinson",
    email: "demi@nexhr.com",
    department: "Engineering",
    role: "Backend Developer",
    status: "Active",
    avatar: "DW",
  },
  {
    id: "EMP005",
    name: "Candice Wu",
    email: "candice@nexhr.com",
    department: "Engineering",
    role: "Full Stack Developer",
    status: "Active",
    avatar: "CW",
  },
  {
    id: "EMP006",
    name: "Natali Craig",
    email: "natali@nexhr.com",
    department: "Design",
    role: "UX Designer",
    status: "Inactive",
    avatar: "NC",
  },
  {
    id: "EMP007",
    name: "Drew Cano",
    email: "drew@nexhr.com",
    department: "Marketing",
    role: "Marketing Manager",
    status: "Active",
    avatar: "DC",
  },
  {
    id: "EMP008",
    name: "Orlando Diggs",
    email: "orlando@nexhr.com",
    department: "Sales",
    role: "Sales Manager",
    status: "Active",
    avatar: "OD",
  },
];

const AllEmployees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const filteredEmployees = employees.filter(
    (employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        departmentFilter === "all" || 
        employee.department.toLowerCase() === departmentFilter.toLowerCase();
      
      return matchesSearch && matchesDepartment;
    }
  );

  const handleViewEmployee = (employee: any) => {
    // Navigate to employee details page instead of opening dialog
    navigate(`/employee/${employee.id}`);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">All Employees</h1>
              <p className="text-gray-500">Manage your organization's employees</p>
            </div>
            <div className="flex gap-2">
              <Link to="/add-employee">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </Link>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Today's Attendance Widget */}
          <div className="mb-6">
            <TodaysAttendance />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Employee Directory</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search employees..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => {
                        setSearchTerm("");
                        setDepartmentFilter("all");
                      }}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead className="w-[300px]">Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src="" alt={employee.name} />
                              <AvatarFallback>{employee.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              employee.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : employee.status === "On Leave"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewEmployee(employee)}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredEmployees.length}</span> of{" "}
                  <span className="font-medium">{employees.length}</span> employees
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-blue-50">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Employee Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>Make changes to employee information</DialogDescription>
              </DialogHeader>
              {selectedEmployee && (
                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>{selectedEmployee.avatar}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Photo</Button>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input defaultValue={selectedEmployee.name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue={selectedEmployee.email} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Input defaultValue={selectedEmployee.role} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Select defaultValue={selectedEmployee.department.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select defaultValue={selectedEmployee.status.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on leave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Here we would save the changes to the employee
                      setIsEditDialogOpen(false);
                    }}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AllEmployees;
