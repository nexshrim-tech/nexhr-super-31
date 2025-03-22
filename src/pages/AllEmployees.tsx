
import React, { useState, useEffect } from "react";
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
import { Sparkles, Key, Eye, Edit, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeData {
  employeeid: number;
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  department: string;
  jobtitle: string;
  status: string;
  avatar: string;
  departmentname?: string; // From join with department table
}

const AllEmployees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [user]);

  // Fetch employees from Supabase
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Get customer ID from profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('customer_id')
        .eq('id', user?.id)
        .single();
      
      if (!profileData?.customer_id) {
        console.error("Customer ID not found in profile");
        return;
      }

      // Get employees with department names
      const { data, error } = await supabase
        .from('employee')
        .select(`
          employeeid,
          firstname,
          lastname,
          email,
          jobtitle,
          department,
          department:department(departmentname)
        `)
        .eq('customerid', profileData.customer_id);

      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }

      if (data) {
        // Transform the data to match the expected format
        const formattedEmployees = data.map(emp => ({
          employeeid: emp.employeeid,
          id: `EMP${emp.employeeid.toString().padStart(3, '0')}`,
          firstname: emp.firstname || '',
          lastname: emp.lastname || '',
          email: emp.email || '',
          jobtitle: emp.jobtitle || '',
          department: emp.department?.departmentname || 'Unassigned',
          status: 'Active', // Default status
          avatar: `${emp.firstname?.[0] || ''}${emp.lastname?.[0] || ''}`
        }));

        setEmployees(formattedEmployees);
      }
    } catch (error) {
      console.error("Error in fetchEmployees:", error);
      toast({
        title: "Failed to load employees",
        description: "There was an error loading the employee list. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) => {
      const matchesSearch = 
        employee.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.jobtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        departmentFilter === "all" || 
        employee.department.toLowerCase() === departmentFilter.toLowerCase();
      
      return matchesSearch && matchesDepartment;
    }
  );

  const handleViewEmployee = (employee: EmployeeData) => {
    navigate(`/employee/${employee.employeeid}`);
  };
  
  const handleSaveEmployee = async (editedEmployee: any) => {
    try {
      if (!selectedEmployee) return;
      
      // Update employee in Supabase
      const { error } = await supabase
        .from('employee')
        .update({
          firstname: editedEmployee.firstname,
          lastname: editedEmployee.lastname,
          email: editedEmployee.email,
          jobtitle: editedEmployee.jobtitle,
          // Update other fields as needed
        })
        .eq('employeeid', selectedEmployee.employeeid);

      if (error) {
        throw error;
      }

      // Refresh employee list
      fetchEmployees();
      
      setIsEditDialogOpen(false);
      toast({
        title: "Employee updated",
        description: "Employee information has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error updating employee",
        description: error.message || "An error occurred while updating the employee.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedEmployee) return;
    
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

    try {
      // Update password in Supabase
      const { error } = await supabase
        .from('employee')
        .update({ employeepassword: newPassword })
        .eq('employeeid', selectedEmployee.employeeid);

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: `Password has been updated for ${selectedEmployee.firstname} ${selectedEmployee.lastname}.`
      });
      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error updating password",
        description: error.message || "An error occurred while updating the password.",
        variant: "destructive"
      });
    }
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
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-nexhr-primary" />
                  <span className="ml-2 text-gray-600">Loading employees...</span>
                </div>
              ) : (
                <>
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
                        {filteredEmployees.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={isMobile ? 3 : 6} className="text-center py-8 text-gray-500">
                              No employees found. Add employees to your organization.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredEmployees.map((employee) => (
                            <TableRow key={employee.employeeid} className="hover:bg-gray-50 transition-colors">
                              {!isMobile && <TableCell className="font-medium">{employee.id}</TableCell>}
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white text-xs sm:text-sm">
                                      {employee.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm sm:text-base">{employee.firstname} {employee.lastname}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">{employee.email}</div>
                                    {isMobile && (
                                      <div className="text-xs text-gray-500 mt-1">{employee.department} • {employee.jobtitle}</div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              {!isMobile && <TableCell>{employee.department}</TableCell>}
                              {!isMobile && <TableCell>{employee.jobtitle}</TableCell>}
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
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <EmployeePagination 
                    filteredCount={filteredEmployees.length} 
                    totalCount={employees.length} 
                  />
                </>
              )}
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
