import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, Trash, FileText, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";
import { Employee } from "@/services/employeeService";
import { adaptEmployeeData } from "@/components/employees/EmployeeAdapter";

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
import PayslipDialog from "@/components/employees/PayslipDialog";
import OfficialDocumentsDialog from "@/components/employees/OfficialDocumentsDialog";
import PasswordChangeDialog from "@/components/employees/PasswordChangeDialog";

const employeeData = {
  id: "EMP001",
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

const payslipsData = [
  { id: "PAY001", employee: "Chisom Chukwukwe", period: "January 2024", amount: 85000, date: "2024-01-31" },
  { id: "PAY002", employee: "Chisom Chukwukwe", period: "February 2024", amount: 85000, date: "2024-02-29" },
  { id: "PAY003", employee: "Chisom Chukwukwe", period: "March 2024", amount: 87500, date: "2024-03-31" },
  { id: "PAY004", employee: "Chisom Chukwukwe", period: "April 2024", amount: 87500, date: "2024-04-30" },
  { id: "PAY005", employee: "Chisom Chukwukwe", period: "May 2024", amount: 90000, date: "2024-05-31" },
];

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { features } = useSubscription();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showOfficialDocsDialog, setShowOfficialDocsDialog] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [adaptedEmployee, setAdaptedEmployee] = useState<Employee>(adaptEmployeeData(employeeData));
  const [employeeForm, setEmployeeForm] = useState(employeeData);
  const { toast } = useToast();
  
  const employee = employeeForm;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [geofencingEnabled, setGeofencingEnabled] = useState(employeeData.geofencingEnabled);
  const [documentEditDialog, setDocumentEditDialog] = useState<'aadhar' | 'pan' | null>(null);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);

  if (!features.employeeManagement) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Employee Details</h1>
                <p className="text-gray-500">View and manage employee information</p>
              </div>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
            
            <FeatureLock 
              title="Employee Management Feature"
              description="Subscribe to a plan to unlock the ability to view and manage employees in your organization."
            />
          </div>
        </div>
      </div>
    );
  }

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

  const handleBankDetailsChange = (field: string, value: string) => {
    setEmployeeForm((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const handleDownload = (documentType: string) => {
    toast({
      title: "Download initiated",
      description: `${documentType} is being downloaded.`,
    });
  };

  const handleViewDetails = (type: string) => {
    if (type.toLowerCase() === 'salary') {
      setPayslipDialogOpen(true);
    } else {
      toast({
        title: `${type} details`,
        description: `Viewing ${type.toLowerCase()} details for ${employee.name}.`,
      });
    }
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
      description: `Password has been updated for ${employee.name}.`
    });
    setIsPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
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
            <EmployeeProfileCard 
              employee={employee}
              isEditMode={isEditMode}
              onEditProfile={handleEditProfile}
              onCancelEdit={handleCancelEdit}
              onSaveProfile={handleSaveProfile}
              onInputChange={handleInputChange}
            />

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
                    <EmployeePersonalTab 
                      employee={employee}
                      isEditMode={isEditMode}
                      onInputChange={handleInputChange}
                    />
                  </TabsContent>

                  <TabsContent value="work">
                    <EmployeeWorkTab 
                      employee={employee}
                      geofencingEnabled={geofencingEnabled}
                      onGeofencingToggle={handleGeofencingToggle}
                      isEditMode={isEditMode}
                      onInputChange={handleInputChange}
                      onSelectChange={handleSelectChange}
                    />
                  </TabsContent>

                  <TabsContent value="bank">
                    <EmployeeBankTab 
                      bankDetails={employee.bankDetails} 
                      isEditMode={isEditMode}
                      onBankDetailsChange={handleBankDetailsChange}
                    />
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

          <EmployeeTasksSection tasks={employee.tasks} />

          <EmployeeAssetsSection assets={employee.assets} />

          <EmployeeDocumentsSection 
            leaves={employee.leaves}
            onDownload={handleDownload}
            onViewDetails={handleViewDetails}
          />

          <div className="flex flex-wrap justify-between mt-8 mb-4 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setPayslipDialogOpen(true)}>
                <FileText className="h-4 w-4" />
                View Payslips
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                <Key className="h-4 w-4" />
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100"
                onClick={() => setShowOfficialDocsDialog(true)}
              >
                <FileText className="h-4 w-4" />
                Official Documents
              </Button>
            </div>
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

          <DocumentUpdateDialog 
            type={documentEditDialog}
            isOpen={documentEditDialog !== null}
            onClose={() => setDocumentEditDialog(null)}
            onUpload={handleDocumentUpload}
          />

          <EmployeeEditDialog
            isOpen={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            employee={adaptedEmployee}
            onSave={() => {
              setEditDialogOpen(false);
              toast({
                title: "Profile updated",
                description: "Employee profile has been updated successfully.",
              });
            }}
          />

          <PayslipDialog
            isOpen={payslipDialogOpen}
            onOpenChange={setPayslipDialogOpen}
            payslips={payslipsData}
          />

          <PasswordChangeDialog
            isOpen={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
            employee={adaptedEmployee}
          />

          <OfficialDocumentsDialog 
            isOpen={showOfficialDocsDialog}
            onClose={() => setShowOfficialDocsDialog(false)}
            employeeName={employee.name}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
