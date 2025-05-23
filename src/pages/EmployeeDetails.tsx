import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmployeeDetailsHeader from "@/components/employees/EmployeeDetailsHeader";
import EmployeeWorkTab from "@/components/employees/tabs/EmployeeWorkTab";
import EmployeePersonalTab from "@/components/employees/tabs/EmployeePersonalTab";
import EmployeeBankTab from "@/components/employees/tabs/EmployeeBankTab";
import EmployeeDocumentsTab from "@/components/employees/tabs/EmployeeDocumentsTab";
import EmployeeDialogs from "@/components/employees/EmployeeDialogs";
import { Employee } from "@/types/employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showOfficialDocsDialog, setShowOfficialDocsDialog] = useState(false);
  const [documentEditDialog, setDocumentEditDialog] = useState<'aadhar' | 'pan' | null>(null);
  const [adaptedEmployee, setAdaptedEmployee] = useState<Employee | null>(null);
  const [payslips, setPayslips] = useState<any[]>([]);

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

        setEmployee(data);
        setAdaptedEmployee(data);
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

  const handleEditSave = () => {
    // Placeholder for save functionality
    toast({
      title: "Success",
      description: "Employee details updated successfully!",
    });
    setEditDialogOpen(false);
  };

  const handleDocumentUpload = async (type: 'aadhar' | 'pan', filePath: string) => {
    // Placeholder for document upload functionality
    toast({
      title: "Success",
      description: `${type.toUpperCase()} document uploaded successfully!`,
    });
    setDocumentEditDialog(null);
  };

  const handleOpenDocumentDialog = (type: 'aadhar' | 'pan') => {
    setDocumentEditDialog(type);
  };

  const handleCloseDocumentDialog = () => {
    setDocumentEditDialog(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/all-employees")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Employee Details</h1>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading employee details...</div>
          ) : employee ? (
            <div className="space-y-6">
              <EmployeeDetailsHeader employee={employee} />
              
              <Tabs defaultValue="work" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="work">Work</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="bank">Bank</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="work">
                  <EmployeeWorkTab employee={employee} />
                </TabsContent>
                
                <TabsContent value="personal">
                  <EmployeePersonalTab employee={employee} />
                </TabsContent>
                
                <TabsContent value="bank">
                  <EmployeeBankTab employee={employee} />
                </TabsContent>
                
                <TabsContent value="documents">
                  <EmployeeDocumentsTab employee={employee} 
                    onOpenDocumentDialog={handleOpenDocumentDialog}
                  />
                </TabsContent>
              </Tabs>

              <EmployeeDialogs
                documentEditDialog={documentEditDialog}
                editDialogOpen={editDialogOpen}
                payslipDialogOpen={payslipDialogOpen}
                isPasswordDialogOpen={isPasswordDialogOpen}
                showOfficialDocsDialog={showOfficialDocsDialog}
                employee={employee}
                adaptedEmployee={adaptedEmployee}
                payslips={payslips}
                onDocumentUpload={handleDocumentUpload}
                onCloseDocumentDialog={handleCloseDocumentDialog}
                setEditDialogOpen={setEditDialogOpen}
                setPayslipDialogOpen={setPayslipDialogOpen}
                setIsPasswordDialogOpen={setIsPasswordDialogOpen}
                setShowOfficialDocsDialog={setShowOfficialDocsDialog}
                onEditSave={handleEditSave}
              />
            </div>
          ) : (
            <div className="text-center py-8">Employee not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
