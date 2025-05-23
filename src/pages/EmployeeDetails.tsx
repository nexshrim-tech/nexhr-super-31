
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, FileText, Key, CreditCard } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";
import { useToast } from "@/hooks/use-toast";
import { getEmployeeById } from "@/services/employeeService";
import { Employee } from "@/types/employee";
import { adaptEmployeeData, adaptToUIFormat } from "@/components/employees/EmployeeAdapter";
import EmployeeInfoCard from "@/components/employees/EmployeeInfoCard";
import EmployeeTasksSection from "@/components/employees/EmployeeTasksSection";
import EmployeeAssetsSection from "@/components/employees/EmployeeAssetsSection";
import EmployeeDialogs from "@/components/employees/EmployeeDialogs";

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showOfficialDocsDialog, setShowOfficialDocsDialog] = useState(false);
  const [documentEditDialog, setDocumentEditDialog] = useState<'aadhar' | 'pan' | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const employeeData = await getEmployeeById(id);
        if (employeeData) {
          setEmployee(employeeData);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast({
          title: "Error",
          description: "Failed to fetch employee details",
          variant: "destructive",
        });
        navigate("/all-employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate, toast]);

  const handleEditSave = () => {
    setEditDialogOpen(false);
    // Refresh employee data
    if (id) {
      getEmployeeById(id).then(employeeData => {
        if (employeeData) {
          setEmployee(employeeData);
        }
      });
    }
  };

  const handleGoBack = () => {
    navigate("/all-employees");
  };

  const handleDocumentUpload = (type: 'aadhar' | 'pan', filePath: string) => {
    toast({
      title: "Success",
      description: `${type === 'aadhar' ? 'Aadhar' : 'PAN'} card uploaded successfully`,
    });
    setDocumentEditDialog(null);
  };

  if (loading) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading employee details...</div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-full bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex items-center justify-center">
          <div>Employee not found</div>
        </div>
      </div>
    );
  }

  const adaptedEmployee = adaptEmployeeData(employee);
  const uiEmployee = adaptToUIFormat(adaptedEmployee);

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleGoBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">
                  {employee.firstname} {employee.lastname}
                </h1>
                <p className="text-gray-500">{employee.jobtitle}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline"
                onClick={() => setPayslipDialogOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Payslips
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowOfficialDocsDialog(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Documents
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <EmployeeInfoCard 
                employee={uiEmployee}
                onEditAadhar={() => setDocumentEditDialog('aadhar')}
                onEditPan={() => setDocumentEditDialog('pan')}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <EmployeeTasksSection tasks={uiEmployee.tasks || []} />
              <EmployeeAssetsSection assets={uiEmployee.assets || []} />
            </div>
          </div>

          <EmployeeDialogs
            documentEditDialog={documentEditDialog}
            editDialogOpen={editDialogOpen}
            payslipDialogOpen={payslipDialogOpen}
            isPasswordDialogOpen={isPasswordDialogOpen}
            showOfficialDocsDialog={showOfficialDocsDialog}
            employee={employee}
            adaptedEmployee={adaptedEmployee}
            payslips={[]}
            onDocumentUpload={handleDocumentUpload}
            onCloseDocumentDialog={() => setDocumentEditDialog(null)}
            setEditDialogOpen={setEditDialogOpen}
            setPayslipDialogOpen={setPayslipDialogOpen}
            setIsPasswordDialogOpen={setIsPasswordDialogOpen}
            setShowOfficialDocsDialog={setShowOfficialDocsDialog}
            onEditSave={handleEditSave}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
