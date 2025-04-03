
import React, { useState, useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuth } from "@/context/AuthContext";
import { getCurrentCustomer } from "@/services/customerService";
import { getEmployees, Employee } from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { Skeleton } from "@/components/ui/skeleton";

const AllEmployees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentMap, setDepartmentMap] = useState<{[key: number]: string}>({});
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const customer = await getCurrentCustomer(user);
          if (customer) {
            setCustomerId(customer.customerid);
            
            // Fetch departments first
            const departments = await getDepartments(customer.customerid);
            const deptMap: {[key: number]: string} = {};
            departments.forEach(dept => {
              deptMap[dept.departmentid] = dept.name;
            });
            setDepartmentMap(deptMap);
            
            // Fetch employees
            const employeeList = await getEmployees(customer.customerid);
            setEmployees(employeeList);
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast({
          title: "Error loading employees",
          description: "Could not load employee data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const filteredEmployees = employees.filter(
    (employee) => {
      const fullName = `${employee.firstname} ${employee.lastname}`;
      const matchesSearch = 
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.department && departmentMap[employee.department]?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employee.jobtitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        employee.employeeid.toString().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        departmentFilter === "all" || 
        (employee.department && departmentMap[employee.department]?.toLowerCase() === departmentFilter.toLowerCase());
      
      return matchesSearch && matchesDepartment;
    }
  );

  const handleViewEmployee = (employee: Employee) => {
    navigate(`/employee/${employee.employeeid}`);
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
      description: `Password has been updated for ${selectedEmployee.firstname} ${selectedEmployee.lastname}.`
    });
    setIsPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const renderEmployeeTable = () => {
    if (isLoading) {
      return [...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {!isMobile && <TableCell><Skeleton className="h-8 w-20" /></TableCell>}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div>
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
          </TableCell>
          {!isMobile && <TableCell><Skeleton className="h-5 w-24" /></TableCell>}
          {!isMobile && <TableCell><Skeleton className="h-5 w-28" /></TableCell>}
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </TableCell>
        </TableRow>
      ));
    }

    if (filteredEmployees.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-8 text-gray-500">
            {employees.length > 0 
              ? "No employees match your search criteria." 
              : "No employees found. Add employees to see them here."}
          </TableCell>
        </TableRow>
      );
    }

    return filteredEmployees.map((employee) => (
      <TableRow key={employee.employeeid} className="hover:bg-gray-50 transition-colors">
        {!isMobile && <TableCell className="font-medium">EMP{employee.employeeid.toString().padStart(3, '0')}</TableCell>}
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm">
              {employee.profilepicturepath ? (
                <AvatarImage src={employee.profilepicturepath} alt={`${employee.firstname} ${employee.lastname}`} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white text-xs sm:text-sm">
                  {employee.firstname.charAt(0)}{employee.lastname.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium text-sm sm:text-base">{employee.firstname} {employee.lastname}</div>
              <div className="text-xs sm:text-sm text-gray-500">{employee.email}</div>
              {isMobile && (
                <div className="text-xs text-gray-500 mt-1">
                  {employee.department ? departmentMap[employee.department] : 'No Department'} 
                  {employee.jobtitle ? ` • ${employee.jobtitle}` : ''}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        {!isMobile && (
          <TableCell>
            {employee.department ? departmentMap[employee.department] : 'No Department'}
          </TableCell>
        )}
        {!isMobile && <TableCell>{employee.jobtitle || 'Not assigned'}</TableCell>}
        <TableCell>
          <Badge
            className={`${
              employee.employeestatus === "Active"
                ? "bg-green-100 text-green-800 border border-green-200"
                : employee.employeestatus === "On Leave"
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            } transition-colors text-xs`}
          >
            {employee.employeestatus || 'Active'}
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
    ));
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
          
          <EmployeeListHeader customerId={customerId} />

          {/* Today's Attendance Widget */}
          <div className="mb-6 transform hover:scale-[1.01] transition-all duration-300 dashboard-card shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <TodaysAttendance customerId={customerId} isLoading={isLoading} />
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
                  departments={Object.values(departmentMap)}
                  isLoading={isLoading}
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
                    {renderEmployeeTable()}
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
            departments={Object.entries(departmentMap).map(([id, name]) => ({ 
              id: parseInt(id), 
              name 
            }))}
          />

          {/* Password Change Dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  {selectedEmployee && `Set a new password for ${selectedEmployee.firstname} ${selectedEmployee.lastname}`}
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
