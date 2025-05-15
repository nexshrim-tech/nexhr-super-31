import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";
import SidebarNav from "@/components/SidebarNav";
import { Employee, getEmployeeById, updateEmployee, deleteEmployee } from "@/services/employeeService";
import { getAttendanceSettings, updateAttendanceSettings, createAttendanceSettings } from "@/services/attendance/attendanceSettingsService";
import { adaptEmployeeData, adaptToUIFormat } from "@/components/employees/EmployeeAdapter";
import EmployeeProfileCard from "@/components/employees/EmployeeProfileCard";
import EmployeeTasksSection from "@/components/employees/EmployeeTasksSection";
import EmployeeAssetsSection from "@/components/employees/EmployeeAssetsSection";
import EmployeeDocumentsSection from "@/components/employees/EmployeeDocumentsSection";
import EmployeeActions from "@/components/employees/EmployeeActions";
import ConfirmDeleteDialog from "@/components/employees/ConfirmDeleteDialog";
import EmployeeDetailsHeader from "@/components/employees/EmployeeDetailsHeader";
import EmployeeMainInfo from "@/components/employees/EmployeeMainInfo";
import EmployeeDialogs from "@/components/employees/EmployeeDialogs";

const payslipsData = [
  { id: "PAY001", employee: "Chisom Chukwukwe", period: "January 2024", amount: 85000, date: "2024-01-31" },
  { id: "PAY002", employee: "Chisom Chukwukwe", period: "February 2024", amount: 85000, date: "2024-02-29" },
  { id: "PAY003", employee: "Chisom Chukwukwe", period: "March 2024", amount: 87500, date: "2024-03-31" },
  { id: "PAY004", employee: "Chisom Chukwukwe", period: "April 2024", amount: 87500, date: "2024-04-30" },
  { id: "PAY005", employee: "Chisom Chukwukwe", period: "May 2024", amount: 90000, date: "2024-05-31" },
];

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { features } = useSubscription();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showOfficialDocsDialog, setShowOfficialDocsDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeForm, setEmployeeForm] = useState<any>(null);
  const [adaptedEmployee, setAdaptedEmployee] = useState<Employee | null>(null);
  const [geofencingEnabled, setGeofencingEnabled] = useState(false);
  const { toast } = useToast();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [documentEditDialog, setDocumentEditDialog] = useState<'aadhar' | 'pan' | null>(null);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [attendanceSettings, setAttendanceSettings] = useState<any>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id && !isNaN(parseInt(id))) {
        try {
          setLoading(true);
          const employeeId = id;
          const empData = await getEmployeeById(employeeId);
          
          if (empData) {
            setEmployee(empData);
            // Convert to UI format for the form
            const uiFormattedData = adaptToUIFormat(empData);
            setEmployeeForm(uiFormattedData);
            setAdaptedEmployee(empData);
            
            // Fetch attendance settings
            const settings = await getAttendanceSettings(employeeId);
            if (settings && settings.length > 0) {
              setAttendanceSettings(settings[0]);
              setGeofencingEnabled(settings[0].geofencingenabled || false);
            }
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

  const handleGeofencingToggle = async (value: boolean) => {
    setGeofencingEnabled(value);
    
    if (employee && employee.employeeid) {
      try {
        if (attendanceSettings) {
          await updateAttendanceSettings(attendanceSettings.id, {
            geofencingenabled: value
          });
        } else {
          await createAttendanceSettings({
            employee_id: employee.employeeid,
            customerid: employee.customerid || "",
            geofencingenabled: value,
            photoverificationenabled: false,
            latethreshold: "15",
            workstarttime: "09:00:00"
          });
        }
        
        toast({
          title: "Settings updated",
          description: `Geofencing has been ${value ? 'enabled' : 'disabled'} for this employee.`,
        });
      } catch (error) {
        console.error("Error updating geofencing settings:", error);
        toast({
          title: "Error",
          description: "Failed to update geofencing settings. Please try again.",
          variant: "destructive",
        });
        setGeofencingEnabled(!value);
      }
    }
  };

  const handleDocumentUpload = (type: 'aadhar' | 'pan') => {
    setDocumentEditDialog(null);
    toast({
      title: "Document uploaded",
      description: `The ${type} document has been uploaded successfully.`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setEmployeeForm(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const handleDownload = (document: string) => {
    toast({
      title: "Download started",
      description: `The ${document} is being downloaded.`,
    });
  };

  const handleViewDetails = () => {
    toast({
      title: "View details",
      description: "Document details view is not implemented in this demo.",
    });
  };

  const handleRemoveEmployee = async () => {
    if (employee) {
      try {
        // Completely delete the employee from the database
        await deleteEmployee(employee.employeeid);
        
        toast({
          title: "Employee removed",
          description: "The employee has been permanently deleted from the system.",
        });
        
        // Navigate back to the employees list
        navigate("/all-employees");
      } catch (error) {
        console.error("Error removing employee:", error);
        toast({
          title: "Error",
          description: "Failed to delete employee. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Demo mode",
        description: "Employee would be removed in a real application.",
      });
      navigate("/all-employees");
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = async () => {
    if (employee && employeeForm) {
      try {
        // Convert from UI format back to the database model format
        const updatedEmployeeData: Partial<Employee> = {
          firstname: employeeForm.name.split(' ')[0] || '',
          lastname: employeeForm.name.split(' ')[1] || '',
          email: employeeForm.email || '',
          phonenumber: employeeForm.phone || '',
          jobtitle: employeeForm.role || '',
          department: employeeForm.department || '',
          dateofbirth: employeeForm.dob || null,
          gender: employeeForm.gender || '',
          address: employeeForm.address || '',
          joiningdate: employeeForm.joining || null,
          employmentstatus: employeeForm.status || 'Active',
          employmenttype: employeeForm.employmenttype || '',
          city: employeeForm.city || '',
          state: employeeForm.state || '',
          country: employeeForm.country || '',
          postalcode: employeeForm.postalcode || '',
          bloodgroup: employeeForm.bloodgroup || '',
          fathersname: employeeForm.fatherName || '',
          maritalstatus: employeeForm.maritalstatus || '',
          disabilitystatus: employeeForm.hasDisability ? 'Yes' : 'No',
          nationality: employeeForm.nationality || '',
          worklocation: employeeForm.worklocation || '',
          monthlysalary: typeof employeeForm.monthlysalary === 'string' 
            ? parseFloat(employeeForm.monthlysalary) 
            : (employeeForm.monthlysalary || 0),
          leavebalance: typeof employeeForm.leavebalance === 'string' 
            ? parseInt(employeeForm.leavebalance) 
            : (employeeForm.leavebalance || 0)
        };
        
        await updateEmployee(employee.employeeid, updatedEmployeeData);
        
        // Refresh employee data from the database
        const refreshedEmployee = await getEmployeeById(employee.employeeid);
        if (refreshedEmployee) {
          setEmployee(refreshedEmployee);
          setAdaptedEmployee(refreshedEmployee);
          setEmployeeForm(adaptToUIFormat(refreshedEmployee));
        }
        
        toast({
          title: "Profile updated",
          description: "Employee profile has been updated successfully.",
        });
      } catch (error) {
        console.error("Error updating employee:", error);
        toast({
          title: "Error",
          description: "Failed to update employee profile. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    if (employee) {
      setEmployeeForm(adaptToUIFormat(employee));
    }
    
    setIsEditMode(false);
  };

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

  if (loading) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <EmployeeDetailsHeader />
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading employee details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guard against no employee data
  if (!employeeForm) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <EmployeeDetailsHeader />
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
          <EmployeeDetailsHeader employeeName={employeeForm.name} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <EmployeeProfileCard 
              employee={employeeForm}
              isEditMode={isEditMode}
              onEditProfile={handleEmployeeActions.handleEditProfile}
              onCancelEdit={handleEmployeeActions.handleCancelEdit}
              onSaveProfile={handleEmployeeActions.handleSaveProfile}
              onInputChange={handleEmployeeActions.handleInputChange}
            />

            <EmployeeMainInfo 
              employee={employeeForm}
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

          <EmployeeTasksSection tasks={employeeForm.tasks} />
          <EmployeeAssetsSection assets={employeeForm.assets} />
          <EmployeeDocumentsSection 
            leaves={employeeForm.leaves}
            onDownload={handleEmployeeActions.handleDownload}
            onViewDetails={handleEmployeeActions.handleViewDetails}
          />

          <EmployeeActions
            onViewPayslips={() => setPayslipDialogOpen(true)}
            onChangePassword={() => setIsPasswordDialogOpen(true)}
            onViewOfficialDocs={() => setShowOfficialDocsDialog(true)}
            employeeName={employeeForm.name}
          />

          <ConfirmDeleteDialog 
            employeeName={employeeForm.name}
            onConfirmDelete={handleEmployeeActions.handleRemoveEmployee}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
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
