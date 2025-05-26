
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Employee, createEmployee } from "@/services/employeeService";
import { registerEmployeeAuth } from "@/services/employeeValidationService";

export const useEmployeeCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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

  const validateForm = (
    employeeData: Partial<Employee>,
    isEmployeeIdValid: boolean,
    customerId: string | null,
    customerAuthId: string | null,
    isLoading: boolean
  ) => {
    console.log('Validating form with:', {
      isLoading,
      customerId,
      customerAuthId,
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
      console.error('Missing organization ID:', { customerId, customerAuthId });
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

  const createEmployeeWithAuth = async (
    employeeData: Partial<Employee>,
    employeeEmail: string,
    employeePassword: string,
    customerId: string | null,
    customerAuthId: string | null
  ) => {
    try {
      setIsCreatingEmployee(true);
      
      const organizationId = customerId || customerAuthId;
      
      console.log('Creating employee with data:', employeeData);
      console.log('Organization ID:', organizationId);
      
      const employeeToCreate = {
        ...employeeData,
        customerid: organizationId
      } as Employee & { customerid: string };

      // Step 1: Create the employee record first
      const newEmployee = await createEmployee(employeeToCreate);
      console.log('Employee created successfully:', newEmployee);
      
      // Step 2: If credentials are provided, create auth account
      if (employeeEmail && employeePassword && newEmployee?.employeeid) {
        try {
          console.log('Creating auth account for employee:', newEmployee.employeeid);
          setIsCreatingAccount(true);
          
          const authUserId = await registerEmployeeAuth(
            employeeEmail, 
            employeePassword, 
            newEmployee.employeeid
          );
          
          if (authUserId) {
            console.log('Auth account created successfully:', authUserId);
            toast({
              title: "Success",
              description: `Employee created successfully! User account for ${employeeEmail} has been created and linked to all systems.`,
            });
          } else {
            throw new Error('Failed to create auth account - no user ID returned');
          }
        } catch (authError: any) {
          console.error('Auth registration error:', authError);
          
          toast({
            title: "Partial Success",
            description: `Employee record created but failed to register user account: ${authError.message}. You can try adding login credentials later.`,
            variant: "destructive",
          });
        } finally {
          setIsCreatingAccount(false);
        }
      } else {
        console.log('No credentials provided, skipping auth account creation');
        toast({
          title: "Success",
          description: "Employee has been created successfully without login credentials.",
        });
      }
      
      // Navigate to the employee detail page or back to the list
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
      setIsCreatingAccount(false);
    }
  };

  return {
    isCreatingEmployee,
    isCreatingAccount,
    validateForm,
    createEmployeeWithAuth,
  };
};
