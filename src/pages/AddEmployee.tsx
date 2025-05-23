import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Employee, createEmployee } from "@/services/employeeService";
import { EmployeePersonalTab } from "@/components/employees/tabs/EmployeePersonalTab";
import { EmployeeWorkTab } from "@/components/employees/tabs/EmployeeWorkTab";
import { EmployeeBankTab } from "@/components/employees/tabs/EmployeeBankTab";
import { EmployeeDocumentsTab } from "@/components/employees/tabs/EmployeeDocumentsTab";
import { ArrowLeft, UserPlus } from "lucide-react";

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Ensure required fields are present
      const employeeToCreate = {
        ...employeeData,
        customerid: employeeData.customerid || 'default-customer-id',
        phonenumber: employeeData.phonenumber ? Number(employeeData.phonenumber) : 0,
        monthlysalary: employeeData.monthlysalary ? Number(employeeData.monthlysalary) : 0,
        leavebalance: employeeData.leavebalance ? Number(employeeData.leavebalance) : 0,
      } as Omit<Employee, 'employeeid'>;

      console.log('Creating employee with data:', employeeToCreate);
      
      const newEmployee = await createEmployee(employeeToCreate);
      
      toast({
        title: "Success",
        description: "Employee has been created successfully.",
      });
      
      // Navigate to employee details or back to list
      if (newEmployee?.employeeid) {
        navigate(`/employees/${newEmployee.employeeid}`);
      } else {
        navigate('/employees');
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

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
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
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="work">Work Details</TabsTrigger>
                <TabsTrigger value="bank">Bank Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <EmployeePersonalTab 
                  employee={employeeData}
                  onUpdate={handleInputChange}
                  isEditing={true}
                />
              </TabsContent>

              <TabsContent value="work">
                <EmployeeWorkTab 
                  employee={employeeData}
                  onUpdate={handleInputChange}
                  isEditing={true}
                />
              </TabsContent>

              <TabsContent value="bank">
                <EmployeeBankTab 
                  employeeId={''}
                  isEditing={true}
                />
              </TabsContent>

              <TabsContent value="documents">
                <EmployeeDocumentsTab 
                  employeeId={''}
                  isEditing={true}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate('/employees')}
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
