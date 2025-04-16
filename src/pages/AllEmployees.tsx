import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/ui/layout";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sparkles, Key, Eye, Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEmployees, Employee } from "@/services/employeeService";
import EmployeeEditDialog from "@/components/employees/EmployeeEditDialog";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeListHeader from "@/components/employees/EmployeeListHeader";
import EmployeePagination from "@/components/employees/EmployeePagination";
import TodaysAttendance from "@/components/TodaysAttendance";

const AllEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error loading employees:', error);
        toast({
          title: "Error loading employees",
          description: "There was a problem loading the employee list.",
          variant: "destructive",
        });
      }
    };

    loadEmployees();
  }, [toast]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.jobtitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      employee.department?.toString() === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
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
        <TodaysAttendance />

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

          <div className="rounded-md border overflow-hidden shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
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
                  <TableRow key={employee.employeeid}>
                    {!isMobile && <TableCell className="font-medium">{employee.employeeid}</TableCell>}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white text-xs sm:text-sm">
                            {`${employee.firstname[0]}${employee.lastname[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm sm:text-base">
                            {`${employee.firstname} ${employee.lastname}`}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">{employee.email}</div>
                          {isMobile && (
                            <div className="text-xs text-gray-500 mt-1">
                              {employee.jobtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {!isMobile && <TableCell>{employee.department}</TableCell>}
                    {!isMobile && <TableCell>{employee.jobtitle}</TableCell>}
                    <TableCell>
                      <Badge
                        className={`${
                          employee.employeestatus === "Active"
                            ? "bg-green-100 text-green-800 border border-green-200"
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
                ))}
              </TableBody>
            </Table>
          </div>
          
          <EmployeePagination 
            filteredCount={filteredEmployees.length} 
            totalCount={employees.length} 
          />
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
                {selectedEmployee && `Set a new password for ${selectedEmployee.firstname} ${selectedEmployee.lastname}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
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
    </Layout>
  );
};

export default AllEmployees;
