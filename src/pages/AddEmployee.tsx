
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Employee, createEmployee } from "@/services/employeeService";
import EmployeePersonalTab from "@/components/employees/tabs/EmployeePersonalTab";
import EmployeeWorkTab from "@/components/employees/tabs/EmployeeWorkTab";
import EmployeeBankTab from "@/components/employees/tabs/EmployeeBankTab";
import ProfilePhotoUpload from "@/components/employees/ProfilePhotoUpload";
import DocumentUploadForm from "@/components/employees/DocumentUploadForm";
import { ArrowLeft, UserPlus } from "lucide-react";
import { adaptToUIFormat } from "@/components/employees/EmployeeAdapter";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({
    customerid: 'default-customer-id',
    employmentstatus: 'Active',
    employmenttype: 'Full-time',
    gender: 'Male',
    maritalstatus: 'Single',
    disabilitystatus: 'No Disability',
  });

  const handleInputChange = (field: keyof Employee, value: any) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePhotoUpload = (photoUrl: string) => {
    handleInputChange('profilepicturepath', photoUrl);
  };

  const handleDocumentsChange = (documents: Record<string, string>) => {
    // Store documents as JSONB object
    handleInputChange('documentpath', documents);
  };

  const handleSubmit = async () => {
    try {
      // Validate mandatory documents
      const documents = employeeData.documentpath as Record<string, string> || {};
      if (!documents.aadhar || !documents.pan) {
        toast({
          title: "Error",
          description: "Aadhar Card and PAN Card are mandatory documents.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      
      // Ensure we have the required customerid
      if (!employeeData.customerid) {
        employeeData.customerid = 'default-customer-id';
      }
      
      console.log('Creating employee with data:', employeeData);
      console.log('Document paths (JSONB):', employeeData.documentpath);
      console.log('Profile photo path:', employeeData.profilepicturepath);
      
      const employeeToCreate = {
        ...employeeData,
        customerid: employeeData.customerid
      } as Employee & { customerid: string };

      const newEmployee = await createEmployee(employeeToCreate);
      
      toast({
        title: "Success",
        description: "Employee has been created successfully.",
      });
      
      if (newEmployee?.employeeid) {
        navigate(`/employee/${newEmployee.employeeid}`);
      } else {
        navigate('/all-employees');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: "Failed to create employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/all-employees');
  };

  // Convert employee data to UI format for compatibility with existing components
  const uiEmployeeData = adaptToUIFormat(employeeData as Employee);

  // Bank details with correct property names
  const bankDetails = {
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employee Directory
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Employee
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile Photo Section */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
              <ProfilePhotoUpload
                onPhotoUpload={handleProfilePhotoUpload}
                currentPhoto={employeeData.profilepicturepath}
                employeeName={`${employeeData.firstname || ''} ${employeeData.lastname || ''}`.trim() || 'New Employee'}
              />
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="work">Work Details</TabsTrigger>
                <TabsTrigger value="bank">Bank Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <EmployeePersonalTab 
                  employee={uiEmployeeData}
                  isEditMode={true}
                  onInputChange={(e) => {
                    const { name, value } = e.target;
                    handleInputChange(name as keyof Employee, value);
                  }}
                />
              </TabsContent>

              <TabsContent value="work">
                <EmployeeWorkTab 
                  employee={uiEmployeeData}
                  geofencingEnabled={false}
                  onGeofencingToggle={() => {}}
                  isEditMode={true}
                  onInputChange={(e) => {
                    const { name, value } = e.target;
                    if (name === 'role') {
                      handleInputChange('jobtitle', value);
                    } else if (name === 'employeeId') {
                      handleInputChange('employeeid', value);
                    } else if (name === 'joining') {
                      handleInputChange('joiningdate', value);
                    } else {
                      handleInputChange(name as keyof Employee, value);
                    }
                  }}
                  onSelectChange={(field, value) => {
                    if (field === 'department') {
                      handleInputChange('department', value);
                    } else if (field === 'employmentstatus') {
                      handleInputChange('employmentstatus', value);
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="bank">
                <EmployeeBankTab 
                  bankDetails={bankDetails}
                  isEditMode={true}
                  onBankDetailsChange={() => {}}
                />
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Employee Documents</h3>
                    <DocumentUploadForm
                      onDocumentsChange={handleDocumentsChange}
                      employeeId="temp-employee"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddEmployee;
