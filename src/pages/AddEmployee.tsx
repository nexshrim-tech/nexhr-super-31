
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useEmployeeFormData } from '@/hooks/useEmployeeFormData';
import { useEmployeeCreation } from '@/hooks/useEmployeeCreation';
import EmployeeBasicInfoForm from '@/components/employees/forms/EmployeeBasicInfoForm';
import EmployeeFormTabs from '@/components/employees/forms/EmployeeFormTabs';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { customerId, customerAuthId, isLoading } = useAuth();
  const [isEmployeeIdValid, setIsEmployeeIdValid] = useState(false);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  const {
    employeeData,
    bankDetails,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleFormInputChange,
    handleEmployeeIdChange,
    handleProfilePhotoUpload,
    handleDocumentsChange,
    handleBankDetailsChange,
    getUIEmployeeData,
  } = useEmployeeFormData();

  const {
    isCreatingEmployee,
    isCreatingAccount,
    validateForm,
    createEmployeeWithAuth,
  } = useEmployeeCreation();

  const handleSubmit = async () => {
    if (!validateForm(employeeData, isEmployeeIdValid, customerId, customerAuthId, isLoading)) {
      return;
    }

    await createEmployeeWithAuth(
      employeeData,
      employeeEmail,
      employeePassword,
      customerId,
      customerAuthId
    );
  };

  const handleGoBack = () => {
    navigate('/all-employees');
  };

  const uiEmployeeData = getUIEmployeeData();

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
            <EmployeeBasicInfoForm
              employeeData={employeeData}
              employeeEmail={employeeEmail}
              employeePassword={employeePassword}
              isEmployeeIdValid={isEmployeeIdValid}
              onEmployeeIdChange={handleEmployeeIdChange}
              onEmployeeIdValidationChange={setIsEmployeeIdValid}
              onEmailChange={setEmployeeEmail}
              onPasswordChange={setEmployeePassword}
              onProfilePhotoUpload={handleProfilePhotoUpload}
            />

            <EmployeeFormTabs
              uiEmployeeData={uiEmployeeData}
              bankDetails={bankDetails}
              onFormInputChange={handleFormInputChange}
              onSelectChange={handleSelectChange}
              onCheckboxChange={handleCheckboxChange}
              onBankDetailsChange={handleBankDetailsChange}
              onDocumentsChange={handleDocumentsChange}
            />

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
