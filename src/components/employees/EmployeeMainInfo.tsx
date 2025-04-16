
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
  onDownload: (type: string) => void;
  onEditDocument: (type: 'aadhar' | 'pan') => void;
}

const EmployeeMainInfo: React.FC<EmployeeMainInfoProps> = ({
  employee,
  isEditMode,
  geofencingEnabled,
  onGeofencingToggle,
  onInputChange,
  onSelectChange,
  onBankDetailsChange,
  onDownload,
  onEditDocument
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
            />
          </TabsContent>

          <TabsContent value="work">
            <EmployeeWorkTab 
              employee={employee}
              geofencingEnabled={geofencingEnabled}
              onGeofencingToggle={onGeofencingToggle}
              isEditMode={isEditMode}
              onInputChange={onInputChange}
              onSelectChange={onSelectChange}
            />
          </TabsContent>

          <TabsContent value="bank">
            <EmployeeBankTab 
              bankDetails={employee.bankDetails} 
              isEditMode={isEditMode}
              onBankDetailsChange={onBankDetailsChange}
            />
          </TabsContent>

          <TabsContent value="documents">
            <EmployeeDocumentsTab 
              onDownload={onDownload}
              onEditDocument={onEditDocument}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeMainInfo;
