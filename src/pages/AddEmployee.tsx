
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Employee, createEmployee } from "@/services/employeeService";
import EmployeePersonalTab from "@/components/employees/tabs/EmployeePersonalTab";
import EmployeeWorkTab from "@/components/employees/tabs/EmployeeWorkTab";
import EmployeeBankTab from "@/components/employees/tabs/EmployeeBankTab";
import ProfilePhotoUpload from "@/components/employees/ProfilePhotoUpload";
import DocumentUploadForm from "@/components/employees/DocumentUploadForm";
import { ArrowLeft, UserPlus } from "lucide-react";
import { adaptToUIFormat } from "@/components/employees/EmployeeAdapter";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({
    customerid: profile?.customer_id || 'default-customer-id',
    employmentstatus: 'Active',
    employmenttype: 'Full-time',
    gender: 'Male',
    maritalstatus: 'Single',
    disabilitystatus: 'No Disability',
  });
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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

  // Register employee in auth system and link to employee record
  const registerEmployeeUser = async (email: string, password: string, employeeId: string) => {
    if (!email || !password) {
      return null;
    }
    
    try {
      setIsCreatingAccount(true);
      
      // Call the register_employee function
      const { data, error } = await supabase.rpc('register_employee', {
        p_email: email,
        p_password: password,
        p_employee_id: employeeId
      });
      
      if (error) {
        console.error('Error registering employee:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in registerEmployeeUser:', error);
      throw error;
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Link employee to existing auth user using RPC function
  const linkEmployeeToProfile = async (employeeId: string) => {
    try {
      // Update profiles table to link employee_id with auth user using RPC
      const { error } = await supabase.rpc('link_employee_to_profile' as any, {
        auth_user_id: employeeData.employeeauthid,
        employee_uuid: employeeId,
        customer_uuid: profile?.customer_id
      });
      
      if (error) {
        console.error('Error linking employee to profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in linkEmployeeToProfile:', error);
      throw error;
    }
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
      
      // Ensure we have the customerid from the logged-in user's profile
      if (profile?.customer_id) {
        employeeData.customerid = profile.customer_id;
      }
      
      console.log('Creating employee with data:', employeeData);
      console.log('Document paths (JSONB):', employeeData.documentpath);
      console.log('Profile photo path:', employeeData.profilepicturepath);
      
      const employeeToCreate = {
        ...employeeData,
        customerid: employeeData.customerid || profile?.customer_id
      } as Employee & { customerid: string };

      const newEmployee = await createEmployee(employeeToCreate);
      
      // If employee auth credentials are provided, register them
      if (employeeEmail && employeePassword && newEmployee?.employeeid) {
        try {
          await registerEmployeeUser(employeeEmail, employeePassword, newEmployee.employeeid);
          toast({
            title: "Employee account created",
            description: `User account for ${employeeEmail} has been created successfully.`,
          });
        } catch (error: any) {
          toast({
            title: "Warning",
            description: `Employee record created but failed to register user account: ${error.message}`,
            variant: "destructive",
          });
        }
      }
      // If existing auth ID is provided, link it to the employee record
      else if (employeeData.employeeauthid && newEmployee?.employeeid) {
        try {
          await linkEmployeeToProfile(newEmployee.employeeid);
          toast({
            title: "Success",
            description: "Employee has been linked to existing user account.",
          });
        } catch (error: any) {
          toast({
            title: "Warning",
            description: `Employee record created but failed to link to user account: ${error.message}`,
            variant: "destructive",
          });
        }
      }
      
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

            {/* Auth Details (New Section) */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-medium mb-4">Authentication Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeEmail">Employee Email</Label>
                  <Input
                    id="employeeEmail"
                    type="email"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    placeholder="Employee login email"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email address for employee to login
                  </p>
                </div>
                <div>
                  <Label htmlFor="employeePassword">Employee Password</Label>
                  <Input
                    id="employeePassword"
                    type="password"
                    value={employeePassword}
                    onChange={(e) => setEmployeePassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Initial password for employee (they can change it later)
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-amber-600">
                    <strong>Note:</strong> Leave these fields empty if you don't want to create a login account for this employee.
                  </p>
                </div>
              </div>
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
                disabled={isLoading || isCreatingAccount}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || isCreatingAccount}
              >
                {isLoading || isCreatingAccount ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddEmployee;
