
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('employee')
          .select('*')
          .eq('employeeid', id)
          .single();

        if (error) {
          console.error("Error fetching employee:", error);
          toast({
            title: "Error",
            description: "Failed to fetch employee details",
            variant: "destructive",
          });
          return;
        }

        const employeeData: Employee = {
          ...data,
          phonenumber: data.phonenumber ? String(data.phonenumber) : undefined,
          postalcode: data.zipcode,
          employmentstatus: data.employmentstatus as 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation' || 'Active',
          documentpath: typeof data.documentpath === 'string' ? data.documentpath : undefined,
        };

        setEmployee(employeeData);
      } catch (error) {
        console.error("Error processing employee data:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id, toast]);

  const handleDownload = (type: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${type}...`,
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-y-auto">
          <div className="container py-8">
            <div className="text-center py-8">Loading employee details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-y-auto">
          <div className="container py-8">
            <div className="text-center py-8">Employee not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/all-employees")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">All Employees</h1>
              <p className="text-gray-600">Employee details</p>
            </div>
            <div className="ml-auto">
              <Button variant="default">Back</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Employee Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Details</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Name :</label>
                    <p className="font-medium">{employee.firstname} {employee.lastname}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">DOB :</label>
                    <p className="font-medium">{employee.dateofbirth ? new Date(employee.dateofbirth).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email :</label>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Gender :</label>
                    <p className="font-medium">{employee.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone Number :</label>
                    <p className="font-medium">{employee.phonenumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address :</label>
                    <p className="font-medium">{employee.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Employee ID :</label>
                    <p className="font-medium">{employee.employeeid}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Joining :</label>
                    <p className="font-medium">{employee.joiningdate ? new Date(employee.joiningdate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm text-gray-600">Expense this month :</label>
                  <p className="text-lg font-semibold text-green-600">$123.45</p>
                </div>
              </div>

              {/* Track Section */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Track</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map placeholder</p>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Tasks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span>Create Wireframes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">08/02/25</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span>Use dummy data in tasks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">08/02/25</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span>Fix Scrolling in Prototype</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">08/02/25</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Pending</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Inactive</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assets Section */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Assets</h3>
                <div className="text-center py-8 text-gray-500">
                  No assets/List
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Attendance Report:</label>
                  <Button variant="outline" size="sm" onClick={() => handleDownload('Attendance Report')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel Report
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="font-medium">Aadhar Card :</label>
                  <Button variant="outline" size="sm" onClick={() => handleDownload('Aadhar Card')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Aadhar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="font-medium">Pan Card :</label>
                  <Button variant="outline" size="sm" onClick={() => handleDownload('Pan Card')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download pan card
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="font-medium">Leaves this month:</label>
                  <span className="px-3 py-1 border rounded">5/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="font-medium">Salary details:</label>
                  <Button variant="default" size="sm">Details</Button>
                </div>
              </div>

              {/* Remove Button */}
              <div className="text-center">
                <Button variant="destructive" size="lg">Remove</Button>
              </div>
            </div>

            {/* Right Side - Employee Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Profile Header with Background */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
                      {employee.profilepicturepath ? (
                        <img 
                          src={employee.profilepicturepath} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                          {employee.firstname?.[0]}{employee.lastname?.[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="pt-16 p-6 text-center">
                  <h3 className="text-xl font-semibold">{employee.firstname} {employee.lastname}</h3>
                  <p className="text-gray-600 mb-6">{employee.jobtitle || 'UI Designer'}</p>

                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">phone: {employee.phonenumber || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Email: {employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{employee.employeeid}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 mt-6">
                    <Button size="sm" variant="outline">📞</Button>
                    <Button size="sm" variant="outline">💬</Button>
                    <Button size="sm" variant="outline">📧</Button>
                    <Button size="sm" variant="outline">👥</Button>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current</span>
                      <span>Full location</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4">Live</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
