import React, { useState, useEffect } from 'react';
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
import EmployeeIdInput from "@/components/employees/EmployeeIdInput";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, customerId, customerAuthId, isLoading } = useAuth();
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [isEmployeeIdValid, setIsEmployeeIdValid] = useState(false);
  
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({
    employmentstatus: 'Active',
    employmenttype: 'Full-time',
    gender: 'Male',
    maritalstatus: 'Single',
    disabilitystatus: 'No Disability',
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    jobtitle: '',
    department: '',
    dateofbirth: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalcode: '',
    bloodgroup: '',
    fathersname: '',
    nationality: '',
    worklocation: '',
    monthlysalary: 0,
    leavebalance: 0,
    employeeid: '' // Initialize as empty string for user input
  });
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const handleInputChange = (field: keyof Employee, value: any) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    const fieldMappings: { [key: string]: keyof Employee } = {
      'department': 'department',
      'employmentstatus': 'employmentstatus',
      'employmenttype': 'employmenttype',
      'gender': 'gender',
      'bloodgroup': 'bloodgroup',
      'bloodGroup': 'bloodgroup',
      'maritalstatus': 'maritalstatus',
      'nationality': 'nationality'
    };

    const mappedField = fieldMappings[field];
    if (mappedField) {
      handleInputChange(mappedField, value);
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    if (field === 'hasDisability') {
      handleInputChange('disabilitystatus', checked ? 'Yes' : 'No Disability');
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const fieldMappings: { [key: string]: keyof Employee } = {
      'name': 'firstname',
      'firstname': 'firstname',
      'lastname': 'lastname',
      'email': 'email',
      'phone': 'phonenumber',
      'role': 'jobtitle',
      'jobtitle': 'jobtitle',
      'department': 'department',
      'joining': 'joiningdate',
      'joiningdate': 'joiningdate',
      'dob': 'dateofbirth',
      'dateofbirth': 'dateofbirth',
      'fatherName': 'fathersname',
      'fathersname': 'fathersname',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'country': 'country',
      'postalcode': 'postalcode',
      'nationality': 'nationality',
      'worklocation': 'worklocation',
      'monthlysalary': 'monthlysalary',
      'leavebalance': 'leavebalance'
    };

    if (name === 'name') {
      const nameParts = value.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setEmployeeData(prev => ({
        ...prev,
        firstname: firstName,
        lastname: lastName
      }));
      return;
    }

    const mappedField = fieldMappings[name];
    if (mappedField) {
      if (mappedField === 'monthlysalary' || mappedField === 'leavebalance') {
        const numericValue = parseFloat(value) || 0;
        handleInputChange(mappedField, numericValue);
      } else {
        handleInputChange(mappedField, value);
      }
    }
  };

  const handleEmployeeIdChange = (newEmployeeId: string) => {
    setEmployeeData(prev => ({
      ...prev,
      employeeid: newEmployeeId
    }));
  };

  const handleProfilePhotoUpload = (photoUrl: string) => {
    handleInputChange('profilepicturepath', photoUrl);
  };

  const handleDocumentsChange = (documents: Record<string, string>) => {
    handleInputChange('documentpath', documents);
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const registerEmployeeUser = async (email: string, password: string, employeeId: string) => {
    if (!email || !password) {
      return null;
    }
    
    try {
      setIsCreatingAccount(true);
      
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

  React.useEffect(() => {
    if (!isLoading && (customerId || customerAuthId)) {
      const organizationId = customerId || customerAuthId;
      console.log('Initializing employee with customer data:', {
        customerId,
        customerAuthId,
        organizationId
      });
      
      setEmployeeData(prev => ({
        ...prev,
        customerid: organizationId,
        employeeauthid: prev.employeeauthid || customerAuthId
      }));
    }
  }, [isLoading, customerId, customerAuthId]);

  const validateForm = () => {
    console.log('Validating form with:', {
      isLoading,
      customerId,
      customerAuthId,
      profile: profile?.role,
      employeeId: employeeData.employeeid,
      isEmployeeIdValid
    });

    if (isLoading) {
      toast({
        title: "Loading",
        description: "Please wait while we load your organization information...",
      });
      return false;
    }

    const organizationId = customerId || customerAuthId;
    if (!organizationId) {
      console.error('Missing organization ID:', { customerId, customerAuthId, profile });
      toast({
        title: "Error",
        description: "Unable to determine customer organization. Please contact support.",
        variant: "destructive",
      });
      return false;
    }

    if (!employeeData.employeeid?.trim()) {
      toast({
        title: "Error",
        description: "Employee ID is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!isEmployeeIdValid) {
      toast({
        title: "Error",
        description: "Please enter a valid and unique Employee ID.",
        variant: "destructive",
      });
      return false;
    }

    const documents = employeeData.documentpath as Record<string, string> || {};
    if (!documents.aadhar || !documents.pan) {
      toast({
        title: "Error",
        description: "Aadhar Card and PAN Card are mandatory documents.",
        variant: "destructive",
      });
      return false;
    }

    if (!employeeData.firstname?.trim()) {
      toast({
        title: "Error",
        description: "First name is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!employeeData.lastname?.trim()) {
      toast({
        title: "Error",
        description: "Last name is required.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getErrorMessage = (error: any): string => {
    if (error.message) {
      if (error.message.includes('employee_customerid_id_key')) {
        return 'This Employee ID already exists for your organization. Please use a different Employee ID.';
      }
      if (error.message.includes('duplicate key value')) {
        return 'This employee information conflicts with an existing record. Please check the Employee ID and try again.';
      }
      if (error.message.includes('Email') && error.message.includes('already registered')) {
        return 'This email address is already registered. Please use a different email address.';
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsCreatingEmployee(true);
      
      const organizationId = customerId || customerAuthId;
      
      console.log('Creating employee with data:', employeeData);
      console.log('Organization ID:', organizationId);
      
      const employeeToCreate = {
        ...employeeData,
        customerid: organizationId
      } as Employee & { customerid: string };

      const newEmployee = await createEmployee(employeeToCreate);
      
      if (employeeEmail && employeePassword && newEmployee?.employeeid) {
        try {
          await registerEmployeeUser(employeeEmail, employeePassword, newEmployee.employeeid);
          toast({
            title: "Success",
            description: `Employee created successfully! User account for ${employeeEmail} has been created and linked to all systems.`,
          });
        } catch (error: any) {
          console.error('Auth registration error:', error);
          toast({
            title: "Partial Success",
            description: `Employee record created but failed to register user account: ${getErrorMessage(error)}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Employee has been created successfully.",
        });
      }
      
      if (newEmployee?.employeeid) {
        navigate(`/employee/${newEmployee.employeeid}`);
      } else {
        navigate('/all-employees');
      }
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsCreatingEmployee(false);
    }
  };

  const handleGoBack = () => {
    navigate('/all-employees');
  };

  const uiEmployeeData = {
    id: '',
    name: `${employeeData.firstname || ''} ${employeeData.lastname || ''}`.trim() || 'New Employee',
    email: employeeData.email || '',
    phone: employeeData.phonenumber || '',
    employeeId: employeeData.employeeid || '',
    role: employeeData.jobtitle || '',
    department: employeeData.department || '',
    dob: employeeData.dateofbirth || '',
    gender: employeeData.gender || 'Male',
    address: employeeData.address || '',
    city: employeeData.city || '',
    state: employeeData.state || '',
    country: employeeData.country || '',
    postalcode: employeeData.postalcode || '',
    joining: employeeData.joiningdate || '',
    status: employeeData.employmentstatus || 'Active',
    employmenttype: employeeData.employmenttype || 'Full-time',
    avatar: employeeData.profilepicturepath || `${(employeeData.firstname || '')[0] || ''}${(employeeData.lastname || '')[0] || ''}`,
    monthlysalary: employeeData.monthlysalary || 0,
    bloodgroup: employeeData.bloodgroup || '',
    bloodGroup: employeeData.bloodgroup || '',
    fatherName: employeeData.fathersname || '',
    maritalstatus: employeeData.maritalstatus || 'Single',
    hasDisability: employeeData.disabilitystatus === 'Yes',
    disabilitystatus: employeeData.disabilitystatus || 'No Disability',
    nationality: employeeData.nationality || '',
    worklocation: employeeData.worklocation || '',
    leavebalance: employeeData.leavebalance || 0,
    firstname: employeeData.firstname || '',
    lastname: employeeData.lastname || '',
    tasks: [],
    assets: [],
    leaves: "0/0",
    bankDetails: bankDetails,
    documents: {
      aadharCard: "",
      panCard: ""
    },
    geofencingEnabled: false
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
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
              <ProfilePhotoUpload
                onPhotoUpload={handleProfilePhotoUpload}
                currentPhoto={employeeData.profilepicturepath}
                employeeName={`${employeeData.firstname || ''} ${employeeData.lastname || ''}`.trim() || 'New Employee'}
              />
            </div>

            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-medium mb-4">Employee Identification</h3>
              <EmployeeIdInput
                value={employeeData.employeeid || ''}
                onChange={handleEmployeeIdChange}
                onValidationChange={setIsEmployeeIdValid}
              />
            </div>

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
                  onInputChange={handleFormInputChange}
                  onSelectChange={handleSelectChange}
                  onCheckboxChange={handleCheckboxChange}
                />
              </TabsContent>

              <TabsContent value="work">
                <EmployeeWorkTab 
                  employee={uiEmployeeData}
                  geofencingEnabled={false}
                  onGeofencingToggle={() => {}}
                  isEditMode={true}
                  onInputChange={handleFormInputChange}
                  onSelectChange={handleSelectChange}
                />
              </TabsContent>

              <TabsContent value="bank">
                <EmployeeBankTab 
                  bankDetails={bankDetails}
                  isEditMode={true}
                  onBankDetailsChange={handleBankDetailsChange}
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
                disabled={isCreatingEmployee || isCreatingAccount}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isCreatingEmployee || isCreatingAccount || isLoading || !isEmployeeIdValid}
              >
                {isCreatingEmployee || isCreatingAccount ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddEmployee;
