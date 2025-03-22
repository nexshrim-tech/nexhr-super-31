import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pen, Plus, UserPlus, UserMinus, BarChart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment,
  fetchEmployees
} from "@/integrations/supabase/functions";

interface Department {
  departmentid: number;
  departmentname: string;
  managerid: number;
  manager?: string;
  employeecount: number;
  annualbudget: number;
  status: string;
  customerid: number;
}

interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle: string;
  avatar?: string;
  department?: string;
}

interface DepartmentFormData {
  name: string;
  manager: string;
  employeeCount: string;
  budget: string;
  status: string;
}

const Department = () => {
  const { user, customerData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    manager: "",
    employeeCount: "",
    budget: "",
    status: "Active"
  });
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!customerData?.customerid) return;
      
      try {
        setLoading(true);
        
        // Fetch departments
        const departmentsData = await fetchDepartments(customerData.customerid);
        
        // Fetch employees
        const employeesData = await fetchEmployees(customerData.customerid);
        
        // Map manager names to departments
        const mappedDepartments = departmentsData.map(dept => {
          const manager = employeesData.find(emp => emp.employeeid === dept.managerid);
          return {
            ...dept,
            manager: manager ? `${manager.firstname} ${manager.lastname}` : 'Unassigned'
          };
        });
        
        // Create avatar initials and map departments
        const mappedEmployees = employeesData.map(emp => {
          const initials = `${emp.firstname?.charAt(0) || ''}${emp.lastname?.charAt(0) || ''}`;
          const dept = departmentsData.find(d => d.departmentid === Number(emp.department));
          
          return {
            ...emp,
            avatar: initials,
            department: dept?.departmentname || 'Unassigned'
          };
        });
        
        setDepartments(mappedDepartments);
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load departments and employees",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [customerData, toast]);

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeecount, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.annualbudget, 0);
  const avgTeamSize = departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      manager: "",
      employeeCount: "",
      budget: "",
      status: "Active"
    });
    setCurrentDepartment(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddDepartment = async () => {
    if (!formData.name || !formData.manager || !formData.employeeCount || !formData.budget) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!customerData?.customerid) {
      toast({
        title: "Authentication Error",
        description: "Please login to add departments.",
        variant: "destructive"
      });
      return;
    }

    try {
      const managerId = Number(formData.manager);
      
      const newDepartmentData = {
        departmentname: formData.name,
        managerid: managerId,
        employeecount: parseInt(formData.employeeCount),
        annualbudget: parseFloat(formData.budget),
        status: formData.status,
        customerid: customerData.customerid
      };

      const newDepartment = await createDepartment(newDepartmentData);
      
      // Add manager name for display
      const manager = employees.find(emp => emp.employeeid === managerId);
      const mappedDept = {
        ...newDepartment,
        manager: manager ? `${manager.firstname} ${manager.lastname}` : 'Unassigned'
      };

      setDepartments([...departments, mappedDept]);
      setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: "Department added",
        description: `${newDepartment.departmentname} has been added to the organization.`
      });
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewDepartment = (department: Department) => {
    setCurrentDepartment(department);
    setIsViewDialogOpen(true);
  };

  const handleEditDepartmentOpen = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.departmentname,
      manager: department.managerid.toString(),
      employeeCount: department.employeecount.toString(),
      budget: department.annualbudget.toString(),
      status: department.status
    });
    setIsEditDialogOpen(true);
  };

  const handleEditDepartment = async () => {
    if (!currentDepartment) return;

    if (!formData.name || !formData.manager || !formData.employeeCount || !formData.budget) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const managerId = Number(formData.manager);
      
      const updatedDepartmentData = {
        departmentname: formData.name,
        managerid: managerId,
        employeecount: parseInt(formData.employeeCount),
        annualbudget: parseFloat(formData.budget),
        status: formData.status
      };

      await updateDepartment(currentDepartment.departmentid, updatedDepartmentData);
      
      // Add manager name for display
      const manager = employees.find(emp => emp.employeeid === managerId);
      
      const updatedDepartments = departments.map(dept => {
        if (dept.departmentid === currentDepartment.departmentid) {
          return {
            ...dept,
            ...updatedDepartmentData,
            manager: manager ? `${manager.firstname} ${manager.lastname}` : 'Unassigned'
          };
        }
        return dept;
      });

      setDepartments(updatedDepartments);
      setIsEditDialogOpen(false);
      resetForm();
      
      toast({
        title: "Department updated",
        description: `${formData.name} has been updated.`
      });
    } catch (error) {
      console.error("Error updating department:", error);
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    
    const deptEmployees = employees.filter(emp => 
      Number(emp.department) === department.departmentid
    );
    
    const otherEmployees = employees.filter(emp => 
      Number(emp.department) !== department.departmentid
    );
    
    setDepartmentEmployees(deptEmployees);
    setAvailableEmployees(otherEmployees);
    setIsManageEmployeesDialogOpen(true);
  };

  const handleAddEmployee = async (employee: Employee) => {
    if (!currentDepartment || !customerData?.customerid) return;
    
    try {
      // In a real implementation, you would update the employee's department here
      // For now, we'll just update the state

      const updatedAvailable = availableEmployees.filter(emp => emp.employeeid !== employee.employeeid);
      setAvailableEmployees(updatedAvailable);
      
      const updatedDeptEmployees = [...departmentEmployees, {...employee, department: currentDepartment.departmentname}];
      setDepartmentEmployees(updatedDeptEmployees);
      
      const updatedDepartments = departments.map(dept => {
        if (dept.departmentid === currentDepartment.departmentid) {
          return {
            ...dept,
            employeecount: dept.employeecount + 1
          };
        }
        return dept;
      });
      
      setDepartments(updatedDepartments);
      
      // Update department employee count
      await updateDepartment(currentDepartment.departmentid, {
        employeecount: currentDepartment.employeecount + 1
      });
      
      toast({
        title: "Employee added",
        description: `${employee.firstname} ${employee.lastname} has been added to ${currentDepartment.departmentname}.`
      });
    } catch (error) {
      console.error("Error adding employee to department:", error);
      toast({
        title: "Error",
        description: "Failed to add employee to department.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveEmployee = async (employee: Employee) => {
    if (!currentDepartment || !customerData?.customerid) return;
    
    try {
      // In a real implementation, you would update the employee's department here
      // For now, we'll just update the state

      const updatedDeptEmployees = departmentEmployees.filter(emp => emp.employeeid !== employee.employeeid);
      setDepartmentEmployees(updatedDeptEmployees);
      
      const updatedAvailable = [...availableEmployees, {...employee, department: "Unassigned"}];
      setAvailableEmployees(updatedAvailable);
      
      const updatedDepartments = departments.map(dept => {
        if (dept.departmentid === currentDepartment.departmentid) {
          return {
            ...dept,
            employeecount: Math.max(0, dept.employeecount - 1)
          };
        }
        return dept;
      });
      
      setDepartments(updatedDepartments);
      
      // Update department employee count
      await updateDepartment(currentDepartment.departmentid, {
        employeecount: Math.max(0, currentDepartment.employeecount - 1)
      });
      
      toast({
        title: "Employee removed",
        description: `${employee.firstname} ${employee.lastname} has been removed from ${currentDepartment.departmentname}.`
      });
    } catch (error) {
      console.error("Error removing employee from department:", error);
      toast({
        title: "Error",
        description: "Failed to remove employee from department.",
        variant: "destructive"
      });
    }
  };

  const chartData = departments.map(dept => ({
    name: dept.departmentname,
    employees: dept.employeecount,
    budget: dept.annualbudget / 1000
  }));

  if (loading) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
            <div className="flex justify-center items-center min-h-[80vh]">
              <p>Loading departments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Departments</h1>
              <p className="text-gray-500">Manage organization departments</p>
            </div>
            <Button className="flex items-center gap-2" onClick={openAddDialog}>
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{departments.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{totalEmployees}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">${(totalBudget / 1000000).toFixed(1)}M</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Avg Team Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{avgTeamSize}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Department Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="employees" fill="#8884d8" name="Employees" />
                    <Bar yAxisId="right" dataKey="budget" fill="#82ca9d" name="Budget (thousands)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Department List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Annual Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow key={department.departmentid}>
                        <TableCell className="font-medium">{department.departmentname}</TableCell>
                        <TableCell>{department.manager}</TableCell>
                        <TableCell>{department.employeecount}</TableCell>
                        <TableCell>${department.annualbudget.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {department.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleManageEmployees(department)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Employees</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditDepartmentOpen(department)}>
                              <Pen className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Edit</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewDepartment(department)}>
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">View</span>
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

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept, index) => {
                    const percentage = totalEmployees > 0 ? Math.round((dept.employeecount / totalEmployees) * 100) : 0;
                    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-pink-500", "bg-orange-500"];
                    const colorIndex = index % colors.length;
                    
                    return (
                      <div key={dept.departmentid} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[colorIndex]}`} />
                          <div>{dept.departmentname}</div>
                        </div>
                        <div>{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept, index) => {
                    const percentage = totalBudget > 0 ? Math.round((dept.annualbudget / totalBudget) * 100) : 0;
                    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-pink-500", "bg-orange-500"];
                    const colorIndex = index % colors.length;
                    
                    return (
                      <div key={dept.departmentid} className="flex items-center justify-between">
                        <div>{dept.departmentname}</div>
                        <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[colorIndex]} rounded-full`} 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                        <div>{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Enter the details for the new department.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager *</Label>
                <Select 
                  value={formData.manager} 
                  onValueChange={(value) => handleSelectChange("manager", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem 
                        key={emp.employeeid} 
                        value={emp.employeeid.toString()}
                      >
                        {`${emp.firstname} ${emp.lastname}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Number of Employees *</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  min="0"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  placeholder="Enter employee count"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Annual Budget ($) *</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="1000"
                  min="0"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter annual budget"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleAddDepartment} className="w-full sm:w-auto">Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the details for this department.
            </DialogDescription>
          </DialogHeader>
          {currentDepartment && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Department Name *</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-manager">Manager *</Label>
                    <Select 
                      value={formData.manager} 
                      onValueChange={(value) => handleSelectChange("manager", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem 
                            key={emp.employeeid} 
                            value={emp.employeeid.toString()}
                          >
                            {`${emp.firstname} ${emp.lastname}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-employeeCount">Number of Employees *</Label>
                    <Input
                      id="edit-employeeCount"
                      name="employeeCount"
                      type="number"
                      min="0"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      placeholder="Enter employee count"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-budget">Annual Budget ($) *</Label>
                    <Input
                      id="edit-budget"
                      name="budget"
                      type="number"
                      step="1000"
                      min="0"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Enter annual budget"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={handleEditDepartment} className="w-full sm:w-auto">Update Department</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {currentDepartment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department Name</h3>
                  <p className="mt-1 text-base">{currentDepartment.departmentname}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Manager</h3>
                  <p className="mt-1 text-base">{currentDepartment.manager}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employees</h3>
                  <p className="mt-1 text-base">{currentDepartment.employeecount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Annual Budget</h3>
                  <p className="mt-1 text-base">${currentDepartment.annualbudget.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  <Badge className="bg-green-100 text-green-800">{currentDepartment.status}</Badge>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditDepartmentOpen(currentDepartment);
                }}>Edit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isManageEmployeesDialogOpen} onOpenChange={setIsManageEmployeesDialogOpen}>
        <DialogContent className="max-w-3xl mx-auto">
          <DialogHeader>
            <DialogTitle>Manage Department Employees</DialogTitle>
            <DialogDescription>
              Add or remove employees from the {currentDepartment?.departmentname} department
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-medium mb-3">Current Employees</h3>
              {departmentEmployees.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {departmentEmployees.map(employee => (
                    <div key={employee.employeeid} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <span>{employee.firstname} {employee.lastname}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveEmployee(employee)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md text-gray-500">
                  No employees in this department
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Available Employees</h3>
              {availableEmployees.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {availableEmployees.map(employee => (
                    <div key={employee.employeeid} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span>{employee.firstname} {employee.lastname}</span>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleAddEmployee(employee)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md text-gray-500">
                  No available employees
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsManageEmployeesDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Department;
