import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/ui/layout";
import { Sparkles, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getEmployees, Employee } from "@/services/employeeService";
import { Button } from "@/components/ui/button";
import EmployeeEditDialog from "@/components/employees/EmployeeEditDialog";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeListHeader from "@/components/employees/EmployeeListHeader";
import EmployeePagination from "@/components/employees/EmployeePagination";
import EmployeeTable from "@/components/employees/EmployeeTable";
import PasswordChangeDialog from "@/components/employees/PasswordChangeDialog";
import TodaysAttendance from "@/components/TodaysAttendance";
const AllEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewEmployeeDialogOpen, setIsNewEmployeeDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      console.log("Loading employees...");
      const data = await getEmployees();
      console.log("Employees loaded:", data);
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error loading employees",
        description: "There was a problem loading the employee list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadEmployees();
  }, []);
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || employee.lastname.toLowerCase().includes(searchTerm.toLowerCase()) || employee.email.toLowerCase().includes(searchTerm.toLowerCase()) || (employee.jobtitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department?.toString() === departmentFilter;
    return matchesSearch && matchesDepartment;
  });
  const handleViewEmployee = (employee: Employee) => {
    navigate(`/employee/${employee.employeeid}`);
  };
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };
  const handlePasswordChange = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPasswordDialogOpen(true);
  };
  const handleAddNewEmployee = () => {
    setSelectedEmployee(null);
    setIsNewEmployeeDialogOpen(true);
  };
  const handleSaveEmployee = (updatedEmployee?: Employee) => {
    console.log("Employee saved:", updatedEmployee);
    loadEmployees(); // Reload the employee list to get the latest data from the server
    setIsEditDialogOpen(false);
    setIsNewEmployeeDialogOpen(false);
  };
  return <Layout>
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

        <EmployeeListHeader onAddEmployee={handleAddNewEmployee} />
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
              <div className="flex items-center gap-2">
                
                <EmployeeFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <EmployeeTable employees={filteredEmployees} onViewEmployee={handleViewEmployee} onEditEmployee={handleEditEmployee} onPasswordChange={handlePasswordChange} isLoading={isLoading} />
            
            <div className="p-4">
              <EmployeePagination filteredCount={filteredEmployees.length} totalCount={employees.length} />
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <EmployeeEditDialog isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} employee={selectedEmployee} onSave={handleSaveEmployee} />

        <EmployeeEditDialog isOpen={isNewEmployeeDialogOpen} onOpenChange={setIsNewEmployeeDialogOpen} employee={null} onSave={handleSaveEmployee} isNewEmployee={true} />

        <PasswordChangeDialog isOpen={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen} employee={selectedEmployee} />
      </div>
    </Layout>;
};
export default AllEmployees;