
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeePersonalTab from "./tabs/EmployeePersonalTab";
import EmployeeWorkTab from "./tabs/EmployeeWorkTab";
import EmployeeBankTab from "./tabs/EmployeeBankTab";
import EmployeeDocumentsTab from "./tabs/EmployeeDocumentsTab";

interface EmployeeMainInfoProps {
  employee: any;
  isEditMode: boolean;
  geofencingEnabled: boolean;
  onGeofencingToggle: (checked: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onBankDetailsChange: (field: string, value: string) => void;
  onCheckboxChange?: (field: string, checked: boolean) => void;
  onDownload: (type: string) => void;
  onEditDocument: (type: 'aadhar' | 'pan') => void;
  onOpenDocumentDialog: (type: 'aadhar' | 'pan') => void;
}

const EmployeeMainInfo: React.FC<EmployeeMainInfoProps> = ({
  employee,
  isEditMode,
  geofencingEnabled,
  onGeofencingToggle,
  onInputChange,
  onSelectChange,
  onBankDetailsChange,
  onCheckboxChange,
  onDownload,
  onEditDocument,
  onOpenDocumentDialog
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <EmployeePersonalTab 
              employee={employee}
              isEditMode={isEditMode}
              onInputChange={onInputChange}
              onSelectChange={onSelectChange}
              onCheckboxChange={onCheckboxChange}
            />
          </TabsContent>

          <TabsContent value="work">
            <EmployeeWorkTab 
              employee={{
                department: employee.department || '',
                role: employee.jobtitle || '',
                employeeId: employee.employeeid || '',
                joining: employee.joiningdate || '',
                employmenttype: employee.employmenttype || '',
              }}
              geofencingEnabled={geofencingEnabled}
              onGeofencingToggle={onGeofencingToggle}
              isEditMode={isEditMode}
              onInputChange={onInputChange}
              onSelectChange={onSelectChange}
            />
          </TabsContent>

          <TabsContent value="bank">
            <EmployeeBankTab 
              employeeId={employee.employeeid || ''}
              isEditMode={isEditMode}
              onBankDetailsChange={onBankDetailsChange}
            />
          </TabsContent>

          <TabsContent value="documents">
            <EmployeeDocumentsTab
              employeeId={employee.employeeid || ''}
              onOpenDocumentDialog={onOpenDocumentDialog}
              onDownload={onDownload}
              onEditDocument={onEditDocument}
              documentPaths={{
                aadhar: employee.documentpath,
                pan: employee.documentpath,
                profile: employee.profilepicturepath
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeMainInfo;
