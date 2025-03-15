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
  Eye,
  Plus,
  Upload
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
import { Switch } from "@/components/ui/switch";
import EmployeeEditDialog from "@/components/employees/EmployeeEditDialog";

// Enhanced employee data with additional fields
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
  leaves: "5/10",
  fatherName: "John Chukwukwe",
  bankDetails: {
    accountNumber: "1234567890",
    ifscCode: "ABCD0123456",
    branchName: "Main Branch",
    bankName: "State Bank"
  },
  documents: {
    aadharCard: "aadhar_card.pdf",
    panCard: "pan_card.pdf"
  },
  geofencingEnabled: true
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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [geofencingEnabled, setGeofencingEnabled] = useState(employeeData.geofencingEnabled);
  const [documentEditDialog, setDocumentEditDialog] = useState<'aadhar' | 'pan' | null>(null);

  const handleGeofencingToggle = (checked: boolean) => {
    setGeofencingEnabled(checked);
    toast({
      title: "Geofencing setting updated",
      description: `Geofencing has been ${checked ? 'enabled' : 'disabled'} for ${employee.name}`,
    });
  };

  const handleDocumentUpload = (type: 'aadhar' | 'pan') => {
    toast({
      title: "Document updated",
      description: `${type === 'aadhar' ? 'Aadhar' : 'PAN'} card has been updated successfully.`,
    });
    setDocumentEditDialog(null);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="relative overflow-hidden">
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
              </CardContent>
            </Card>

            {/* Details Section */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <Tabs defaultValue="personal" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="work">Work</TabsTrigger>
                    <TabsTrigger value="bank">Bank Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Father's Name</Label>
                        <p className="text-sm font-medium">{employeeData.fatherName}</p>
                      </div>
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
                    </div>
                  </TabsContent>

                  <TabsContent value="work" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Department</Label>
                        <p className="text-sm font-medium">{employeeData.department}</p>
                      </div>
                      <div>
                        <Label>Role</Label>
                        <p className="text-sm font-medium">{employeeData.role}</p>
                      </div>
                      <div>
                        <Label>Employee ID</Label>
                        <p className="text-sm font-medium">{employeeData.employeeId}</p>
                      </div>
                      <div>
                        <Label>Joining Date</Label>
                        <p className="text-sm font-medium">{employeeData.joining}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Geofencing</Label>
                            <p className="text-sm text-muted-foreground">Enable or disable location tracking</p>
                          </div>
                          <Switch
                            checked={geofencingEnabled}
                            onCheckedChange={handleGeofencingToggle}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Bank Name</Label>
                        <p className="text-sm font-medium">{employeeData.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <Label>Branch Name</Label>
                        <p className="text-sm font-medium">{employeeData.bankDetails.branchName}</p>
                      </div>
                      <div>
                        <Label>Account Number</Label>
                        <p className="text-sm font-medium">{employeeData.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <Label>IFSC Code</Label>
                        <p className="text-sm font-medium">{employeeData.bankDetails.ifscCode}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Aadhar Card</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload('Aadhar Card')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDocumentEditDialog('aadhar')}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>PAN Card</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload('Pan Card')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDocumentEditDialog('pan')}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
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

          {/* Document Update Dialog */}
          <Dialog open={documentEditDialog !== null} onOpenChange={() => setDocumentEditDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update {documentEditDialog === 'aadhar' ? 'Aadhar' : 'PAN'} Card</DialogTitle>
                <DialogDescription>
                  Upload a new document to update the existing one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDocumentEditDialog(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleDocumentUpload(documentEditDialog!)}>
                    Upload
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          <EmployeeEditDialog
            isOpen={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            employee={employeeData}
            onSave={() => {
              setEditDialogOpen(false);
              toast({
                title: "Profile updated",
                description: "Employee profile has been updated successfully.",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
