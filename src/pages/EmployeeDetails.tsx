import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmployeeById } from "@/services/employeeService";
import { Employee } from "@/types/employee";
import { EmployeeDetailsHeader } from "@/components/employees/EmployeeDetailsHeader";
import { EmployeeWorkTab } from "@/components/employees/tabs/EmployeeWorkTab";
import { EmployeePersonalTab } from "@/components/employees/tabs/EmployeePersonalTab";
import { EmployeeBankTab } from "@/components/employees/tabs/EmployeeBankTab";
import { EmployeeDocumentsTab } from "@/components/employees/tabs/EmployeeDocumentsTab";
import { updateAttendanceSetting, createAttendanceSetting, getAttendanceSettings } from "@/services/attendance/attendanceSettingsService";

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("work");

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getEmployeeById(id);
          if (data) {
            setEmployee(data);
          }
        } catch (error) {
          console.error("Error fetching employee:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmployee();
  }, [id]);

  const handleUpdateAttendanceSettings = async (settings: any) => {
    if (!employee || !id) return;

    try {
      const existingSettings = await getAttendanceSettings(id);

      if (existingSettings) {
        await updateAttendanceSetting(existingSettings.attendancesettingid, settings);
      } else {
        await createAttendanceSetting({
          employee_id: id,
          customerid: employee.customerid,
          ...settings,
        });
      }

      // Refresh employee data if needed
    } catch (error) {
      console.error("Error updating attendance settings:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Employee Not Found</h2>
          <p className="text-gray-500">The employee you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EmployeeDetailsHeader employee={employee} />
      
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="work" className="space-y-6">
            <EmployeeWorkTab 
              employee={employee} 
              onUpdateAttendanceSettings={handleUpdateAttendanceSettings} 
            />
          </TabsContent>
          
          <TabsContent value="personal" className="space-y-6">
            <EmployeePersonalTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="bank" className="space-y-6">
            <EmployeeBankTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <EmployeeDocumentsTab employee={employee} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDetails;
