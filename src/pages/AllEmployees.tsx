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
import TodaysAttendance from "@/components/TodaysAttendance";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeEditDialog from "@/components/employees/EmployeeEditDialog";
import EmployeeListHeader from "@/components/employees/EmployeeListHeader";
import EmployeePagination from "@/components/employees/EmployeePagination";

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
    navigate(`/employee/${employee.id}`);
  };
  
  const handleSaveEmployee = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Employee Directory
            </h1>
            <p className="text-gray-600">
              Manage and view all employees in your organization
            </p>
          </div>
          
          <EmployeeListHeader />

          {/* Today's Attendance Widget */}
          <div className="mb-6 transform hover:scale-[1.01] transition-all duration-300 dashboard-card">
            <TodaysAttendance />
          </div>

          <Card className="border-t-4 border-t-nexhr-primary shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                  Employee Directory
                </CardTitle>
                <EmployeeFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  departmentFilter={departmentFilter}
                  setDepartmentFilter={setDepartmentFilter}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
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
                      <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white">
                                {employee.avatar}
                              </AvatarFallback>
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
                            } transition-colors`}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-gray-100 transition-colors"
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
                              className="hover:bg-nexhr-primary/10 hover:text-nexhr-primary transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default AllEmployees;
