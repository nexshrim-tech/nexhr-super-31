import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import our new components
import EmployeeProfileCard from "@/components/employees/EmployeeProfileCard";
import EmployeePersonalTab from "@/components/employees/tabs/EmployeePersonalTab";
import EmployeeWorkTab from "@/components/employees/tabs/EmployeeWorkTab";
import EmployeeBankTab from "@/components/employees/tabs/EmployeeBankTab";
import EmployeeDocumentsTab from "@/components/employees/tabs/EmployeeDocumentsTab";
import EmployeeTasksSection from "@/components/employees/EmployeeTasksSection";
import EmployeeAssetsSection from "@/components/employees/EmployeeAssetsSection";
import EmployeeDocumentsSection from "@/components/employees/EmployeeDocumentsSection";
import DocumentUpdateDialog from "@/components/employees/DocumentUpdateDialog";
import EmployeeEditDialog from "@/components/employees/EmployeeEditDialog";

// Enhanced employee data with additional fields
const employeeData = {
  id: "EMP001", // Added ID to fix TS2741 error
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeForm, setEmployeeForm] = useState(employeeData);
  const { toast } = useToast();
  
  const employee = employeeData;
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
            <EmployeeProfileCard 
              employee={employee}
              isEditMode={isEditMode}
              onEditProfile={handleEditProfile}
              onCancelEdit={handleCancelEdit}
              onSaveProfile={handleSaveProfile}
            />

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

                  <TabsContent value="personal">
                    <EmployeePersonalTab employee={employee} />
                  </TabsContent>

                  <TabsContent value="work">
                    <EmployeeWorkTab 
                      employee={employee}
                      geofencingEnabled={geofencingEnabled}
                      onGeofencingToggle={handleGeofencingToggle}
                    />
                  </TabsContent>

                  <TabsContent value="bank">
                    <EmployeeBankTab bankDetails={employee.bankDetails} />
                  </TabsContent>

                  <TabsContent value="documents">
                    <EmployeeDocumentsTab 
                      onDownload={handleDownload}
                      onEditDocument={(type) => setDocumentEditDialog(type)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <EmployeeTasksSection tasks={employee.tasks} />

          {/* Assets Section */}
          <EmployeeAssetsSection assets={employee.assets} />

          {/* Documents Section */}
          <EmployeeDocumentsSection 
            leaves={employee.leaves}
            onDownload={handleDownload}
            onViewDetails={handleViewDetails}
          />

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
          <DocumentUpdateDialog 
            type={documentEditDialog}
            isOpen={documentEditDialog !== null}
            onClose={() => setDocumentEditDialog(null)}
            onUpload={handleDocumentUpload}
          />

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
