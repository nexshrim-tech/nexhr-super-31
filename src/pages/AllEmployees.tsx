
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TodaysAttendance from "@/components/TodaysAttendance";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeEditDialog from "@/components/employees/EmployeeEditDialog";
import EmployeeListHeader from "@/components/employees/EmployeeListHeader";
import EmployeePagination from "@/components/employees/EmployeePagination";
import UserHeader from "@/components/UserHeader";
import { Sparkles, Key, Eye, Edit } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

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
    navigate(`/employee/${employee.id}`);
  };
  
  const handleSaveEmployee = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Employee updated",
      description: "Employee information has been updated successfully."
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Password updated",
      description: `Password has been updated for ${selectedEmployee.name}.`
    });
    setIsPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex h-full bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <UserHeader title="Employee Directory" />
        <div className="max-w-6xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in flex items-center">
              Employee Directory
              <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse-slow" />
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-nexhr-primary to-purple-600 mt-1 mb-3 rounded-full"></div>
            <p className="text-gray-600">
              Manage and view all employees in your organization
            </p>
          </div>
          
          <EmployeeListHeader />

          {/* Today's Attendance Widget */}
          <div className="mb-6 transform hover:scale-[1.01] transition-all duration-300 dashboard-card shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <TodaysAttendance />
          </div>

          <Card className="border-t-4 border-t-nexhr-primary shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in rounded-lg overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent flex items-center">
                  Employee Directory
                  <span className="relative flex h-3 w-3 ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                </CardTitle>
                <EmployeeFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  departmentFilter={departmentFilter}
                  setDepartmentFilter={setDepartmentFilter}
                />
              </div>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : "p-4 sm:p-6"}>
              <div className="rounded-md border overflow-hidden shadow-sm overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableRow>
                      {!isMobile && <TableHead>Employee ID</TableHead>}
                      <TableHead className="min-w-[200px]">Name</TableHead>
                      {!isMobile && <TableHead>Department</TableHead>}
                      {!isMobile && <TableHead>Role</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors">
                        {!isMobile && <TableCell className="font-medium">{employee.id}</TableCell>}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white text-xs sm:text-sm">
                                {employee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm sm:text-base">{employee.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{employee.email}</div>
                              {isMobile && (
                                <div className="text-xs text-gray-500 mt-1">{employee.department} • {employee.role}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        {!isMobile && <TableCell>{employee.department}</TableCell>}
                        {!isMobile && <TableCell>{employee.role}</TableCell>}
                        <TableCell>
                          <Badge
                            className={`${
                              employee.status === "Active"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : employee.status === "On Leave"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            } transition-colors text-xs`}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1 hover:bg-gray-100 transition-colors text-xs"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1 hover:bg-indigo-100 hover:text-indigo-700 transition-colors text-xs"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsPasswordDialogOpen(true);
                              }}
                            >
                              <Key className="h-3 w-3" />
                              Password
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1 hover:bg-nexhr-primary/10 hover:text-nexhr-primary transition-colors text-xs"
                              onClick={() => handleViewEmployee(employee)}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <EmployeePagination 
                filteredCount={filteredEmployees.length} 
                totalCount={employees.length} 
              />
            </CardContent>
          </Card>

          <EmployeeEditDialog 
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            employee={selectedEmployee}
            onSave={handleSaveEmployee}
          />

          {/* Password Change Dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  {selectedEmployee && `Set a new password for ${selectedEmployee.name}`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AllEmployees;
