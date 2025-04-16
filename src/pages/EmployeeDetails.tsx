import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";
import SidebarNav from "@/components/SidebarNav";
import { Employee } from "@/services/employeeService";
import { adaptEmployeeData } from "@/components/employees/EmployeeAdapter";
import EmployeeProfileCard from "@/components/employees/EmployeeProfileCard";
import EmployeeTasksSection from "@/components/employees/EmployeeTasksSection";
import EmployeeAssetsSection from "@/components/employees/EmployeeAssetsSection";
import EmployeeDocumentsSection from "@/components/employees/EmployeeDocumentsSection";
import EmployeeActions from "@/components/employees/EmployeeActions";
import ConfirmDeleteDialog from "@/components/employees/ConfirmDeleteDialog";
import EmployeeDetailsHeader from "@/components/employees/EmployeeDetailsHeader";
import EmployeeMainInfo from "@/components/employees/EmployeeMainInfo";
import EmployeeDialogs from "@/components/employees/EmployeeDialogs";

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

  const handleEmployeeActions = {
    handleGeofencingToggle,
    handleDocumentUpload,
    handleInputChange,
    handleSelectChange,
    handleBankDetailsChange,
    handleDownload,
    handleViewDetails,
    handleRemoveEmployee,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit
  };

  if (!features.employeeManagement) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <EmployeeDetailsHeader />
            <FeatureLock 
              title="Employee Management Feature"
              description="Subscribe to a plan to unlock the ability to view and manage employees in your organization."
            />
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
          <EmployeeDetailsHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <EmployeeProfileCard 
              employee={employee}
              isEditMode={isEditMode}
              onEditProfile={handleEmployeeActions.handleEditProfile}
              onCancelEdit={handleEmployeeActions.handleCancelEdit}
              onSaveProfile={handleEmployeeActions.handleSaveProfile}
              onInputChange={handleEmployeeActions.handleInputChange}
            />

            <EmployeeMainInfo 
              employee={employee}
              isEditMode={isEditMode}
              geofencingEnabled={geofencingEnabled}
              onGeofencingToggle={handleEmployeeActions.handleGeofencingToggle}
              onInputChange={handleEmployeeActions.handleInputChange}
              onSelectChange={handleEmployeeActions.handleSelectChange}
              onBankDetailsChange={handleEmployeeActions.handleBankDetailsChange}
              onDownload={handleEmployeeActions.handleDownload}
              onEditDocument={(type) => setDocumentEditDialog(type)}
            />
          </div>

          <EmployeeTasksSection tasks={employee.tasks} />
          <EmployeeAssetsSection assets={employee.assets} />
          <EmployeeDocumentsSection 
            leaves={employee.leaves}
            onDownload={handleEmployeeActions.handleDownload}
            onViewDetails={handleEmployeeActions.handleViewDetails}
          />

          <EmployeeActions
            onViewPayslips={() => setPayslipDialogOpen(true)}
            onChangePassword={() => setIsPasswordDialogOpen(true)}
            onViewOfficialDocs={() => setShowOfficialDocsDialog(true)}
            employeeName={employee.name}
          />

          <ConfirmDeleteDialog 
            employeeName={employee.name}
            onConfirmDelete={handleEmployeeActions.handleRemoveEmployee}
          />

          <EmployeeDialogs 
            documentEditDialog={documentEditDialog}
            editDialogOpen={editDialogOpen}
            payslipDialogOpen={payslipDialogOpen}
            isPasswordDialogOpen={isPasswordDialogOpen}
            showOfficialDocsDialog={showOfficialDocsDialog}
            employee={employee}
            adaptedEmployee={adaptedEmployee}
            payslips={payslipsData}
            onDocumentUpload={handleEmployeeActions.handleDocumentUpload}
            onCloseDocumentDialog={() => setDocumentEditDialog(null)}
            setEditDialogOpen={setEditDialogOpen}
            setPayslipDialogOpen={setPayslipDialogOpen}
            setIsPasswordDialogOpen={setIsPasswordDialogOpen}
            setShowOfficialDocsDialog={setShowOfficialDocsDialog}
            onEditSave={() => {
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
