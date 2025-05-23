
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";
import SidebarNav from "@/components/SidebarNav";
import { Employee, getEmployeeById, updateEmployee, deleteEmployee } from "@/services/employeeService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, User, MapPin, Calendar, Briefcase, Download } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { features } = useSubscription();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id && !isNaN(parseInt(id))) {
        try {
          setLoading(true);
          const employeeId = parseInt(id);
          const empData = await getEmployeeById(employeeId);
          
          if (empData) {
            setEmployee(empData);
          } else {
            toast({
              title: "Employee not found",
              description: "The employee you're looking for doesn't exist or has been removed.",
              variant: "destructive",
            });
            navigate("/all-employees");
          }
        } catch (error) {
          console.error("Error fetching employee:", error);
          toast({
            title: "Error",
            description: "Failed to load employee details. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate, toast]);

  const handleRemoveEmployee = async () => {
    if (employee) {
      try {
        await deleteEmployee(employee.employeeid);
        
        toast({
          title: "Employee removed",
          description: "The employee has been permanently deleted from the system.",
        });
        
        navigate("/all-employees");
      } catch (error) {
        console.error("Error removing employee:", error);
        toast({
          title: "Error",
          description: "Failed to delete employee. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (!features.employeeManagement) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <FeatureLock 
              title="Employee Management Feature"
              description="Subscribe to a plan to unlock the ability to view and manage employees in your organization."
            />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading employee details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No employee data available.</p>
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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>All Employees</span>
                <span>/</span>
                <span>Employee details</span>
              </div>
              <h1 className="text-2xl font-semibold">Details</h1>
            </div>
            <Link to="/all-employees">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Employee Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Details Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Name:</p>
                      <p className="font-medium">{employee.firstname} {employee.lastname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">DOB:</p>
                      <p className="font-medium">{employee.dateofbirth ? new Date(employee.dateofbirth).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender:</p>
                      <p className="font-medium">{employee.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number:</p>
                      <p className="font-medium">{employee.phonenumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address:</p>
                      <p className="font-medium">{employee.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee ID:</p>
                      <p className="font-medium">{employee.employeeid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joining:</p>
                      <p className="font-medium">{employee.joiningdate ? new Date(employee.joiningdate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Expense this month:</h3>
                  <p className="text-2xl font-bold text-green-600">$123.45</p>
                </CardContent>
              </Card>

              {/* Track Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Track</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map view will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked className="rounded" />
                        <span>Create Wireframes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">08/02/25</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked className="rounded" />
                        <span>Use dummy data in tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">08/02/25</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span>Fix Scrolling in Prototype</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">08/02/25</span>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Pending</Badge>
                        <Badge variant="secondary">Inactive</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assets Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Assets</h3>
                  <div className="text-center py-8">
                    <p className="text-gray-500">No assets/List</p>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Attendance Report:</span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Excel Report
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Aadhar Card:</span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Aadhar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pan Card:</span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download pan card
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Leaves this month:</span>
                  <span>5/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Salary details:</span>
                  <Button size="sm">Details</Button>
                </div>
              </div>

              {/* Remove Button */}
              <div className="pt-6">
                <Button 
                  variant="destructive" 
                  onClick={handleRemoveEmployee}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* Right Column - Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="relative overflow-hidden p-0">
                  {/* Background Header */}
                  <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    {/* Profile Avatar */}
                    <div className="flex flex-col items-center -mt-12">
                      <Avatar className="h-24 w-24 border-4 border-white bg-white">
                        <AvatarImage src={employee.profilepicturepath || ""} alt={employee.firstname} />
                        <AvatarFallback className="text-lg">
                          {employee.firstname[0]}{employee.lastname[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="mt-4 text-lg font-semibold">
                        {employee.firstname} {employee.lastname}
                      </h3>
                      <p className="text-sm text-gray-500">{employee.jobtitle || 'No job title'}</p>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">phone: {employee.phonenumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Email: {employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{employee.employeeid}</span>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="mt-6 flex justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Current</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs">Full location</span>
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <div className="mt-6">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
