
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  DollarSign, 
  Clock,
  Briefcase,
  Info,
  Trash,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import LocationMap from "@/components/LocationMap";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const employeeData = {
  name: "Chisom Chukwukwe",
  email: "work@email.com",
  phone: "+369 258 147",
  employeeId: "5278429811",
  role: "UI/UX Designer",
  department: "Design",
  dob: "08/25/25",
  gender: "Male",
  address: "1597 540 0985",
  joining: "Sat May 18 2024",
  expense: "$123.45",
  avatar: "CC",
  status: "Active",
  location: { lat: 48.8606, lng: 2.3376 },
  tasks: [
    { id: 1, name: "Create Wireframes", deadline: "08/02/25", status: "Completed", action: "Active" },
    { id: 2, name: "Use dummy data in tasks", deadline: "08/02/25", status: "Completed", action: "Active" },
    { id: 3, name: "Fix Scrolling in Prototype", deadline: "08/02/25", status: "Pending", action: "Inactive" },
  ],
  assets: [],
  leaves: "5/10"
};

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("current");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeForm, setEmployeeForm] = useState(employeeData);
  const { toast } = useToast();
  
  const employee = employeeData;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setEmployeeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownload = (documentType: string) => {
    toast({
      title: "Download initiated",
      description: `${documentType} is being downloaded.`,
    });
  };

  const handleViewDetails = (type: string) => {
    toast({
      title: `${type} details`,
      description: `Viewing ${type.toLowerCase()} details for ${employee.name}.`,
    });
  };

  const handleRemoveEmployee = () => {
    setShowDeleteDialog(false);
    toast({
      title: "Employee removed",
      description: `${employee.name} has been removed from the system.`,
      variant: "destructive",
    });
    setTimeout(() => {
      navigate("/all-employees");
    }, 1500);
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    toast({
      title: "Edit mode",
      description: "You can now edit the employee profile.",
    });
  };

  const handleSaveProfile = () => {
    setIsEditMode(false);
    toast({
      title: "Profile updated",
      description: "Employee profile has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEmployeeForm(employeeData);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">All Employees</h1>
              <p className="text-gray-500">Employee details</p>
            </div>
            <Link to="/all-employees">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 space-y-6">
                {isEditMode ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name:</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={employeeForm.name} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">DOB:</Label>
                          <Input 
                            id="dob" 
                            name="dob" 
                            value={employeeForm.dob} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email:</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            value={employeeForm.email} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender:</Label>
                          <Select 
                            value={employeeForm.gender} 
                            onValueChange={(value) => handleSelectChange("gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number:</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={employeeForm.phone} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address:</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={employeeForm.address} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role:</Label>
                          <Input 
                            id="role" 
                            name="role" 
                            value={employeeForm.role} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department:</Label>
                          <Select 
                            value={employeeForm.department} 
                            onValueChange={(value) => handleSelectChange("department", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Design">Design</SelectItem>
                              <SelectItem value="Engineering">Engineering</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Name:</p>
                      <p className="font-medium">{employee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">DOB:</p>
                      <p className="font-medium">{employee.dob}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email:</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gender:</p>
                      <p className="font-medium">{employee.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone Number:</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address:</p>
                      <p className="font-medium">{employee.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Employee ID:</p>
                      <p className="font-medium">{employee.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Joining:</p>
                      <p className="font-medium">{employee.joining}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Expense this month:</p>
                    <p className="text-green-600 font-semibold">{employee.expense}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full xl:w-80">
                <Card className="relative overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  <div className="px-6 pb-6">
                    <div className="flex flex-col items-center -mt-12">
                      <Avatar className="h-24 w-24 border-4 border-white bg-white">
                        <AvatarImage src="" alt={employee.name} />
                        <AvatarFallback className="text-lg">{employee.avatar}</AvatarFallback>
                      </Avatar>
                      <h3 className="mt-4 text-lg font-semibold">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.role}</p>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{employee.employeeId}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {isEditMode ? (
                        <div className="flex gap-2">
                          <Button variant="outline" className="w-1/2" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button className="w-1/2" onClick={handleSaveProfile}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full" onClick={handleEditProfile}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Track</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full h-[300px] md:h-auto">
                    <Tabs defaultValue="current" className="w-full">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="current">Current</TabsTrigger>
                        <TabsTrigger value="full">Full location</TabsTrigger>
                      </TabsList>
                      <TabsContent value="current" className="m-0 p-0">
                        <div className="h-[300px]">
                          <LocationMap employeeId={Number(id)} />
                        </div>
                      </TabsContent>
                      <TabsContent value="full" className="m-0 p-0">
                        <div className="h-[300px]">
                          <LocationMap employeeId={Number(id)} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 w-12"></th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center gap-1">
                        Name <ArrowLeft className="h-4 w-4 rotate-90" />
                      </div>
                    </th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center gap-1">
                        Deadline <ArrowLeft className="h-4 w-4 rotate-90" />
                      </div>
                    </th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center gap-1">
                        Status <ArrowLeft className="h-4 w-4 rotate-90" />
                      </div>
                    </th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center gap-1">
                        Action <ArrowLeft className="h-4 w-4 rotate-90" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input type="checkbox" checked={task.status === "Completed"} readOnly className="rounded" />
                      </td>
                      <td className="p-3 font-medium">{task.name}</td>
                      <td className="p-3 text-gray-600">{task.deadline}</td>
                      <td className="p-3">
                        <Badge className={getStatusBadgeColor(task.status)}>
                          {task.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getActionBadgeColor(task.action)}>
                          {task.action}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            <Card className="bg-white p-6 rounded-lg border shadow-sm">
              {employee.assets.length > 0 ? (
                <div>
                  {/* Asset list would go here */}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No assets/List</p>
                </div>
              )}
            </Card>
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Attendance Report:</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleDownload('Attendance Report')}
                >
                  <Download className="h-4 w-4" />
                  Download Excel Report
                </Button>
              </div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Aadhar Card:</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleDownload('Aadhar Card')}
                >
                  <Download className="h-4 w-4" />
                  Download Aadhar
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Pan Card:</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleDownload('Pan Card')}
                >
                  <Download className="h-4 w-4" />
                  Download pan card
                </Button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Leaves this month:</h3>
                <Badge variant="outline" className="px-3 py-1">
                  {employee.leaves}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Salary details:</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="default" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Salary Information</h4>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-sm text-gray-500">Basic:</span>
                        <span className="text-sm font-medium">$3,000</span>
                        <span className="text-sm text-gray-500">HRA:</span>
                        <span className="text-sm font-medium">$500</span>
                        <span className="text-sm text-gray-500">DA:</span>
                        <span className="text-sm font-medium">$200</span>
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="text-sm font-medium">$3,700</span>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-xs text-gray-500">
                          Last revised on: 01/01/2023
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 mb-4">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="px-8">
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remove Employee</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove {employee.name} from the system? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleRemoveEmployee}>
                    Remove
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
