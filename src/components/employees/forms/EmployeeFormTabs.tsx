
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeePersonalTab from "@/components/employees/tabs/EmployeePersonalTab";
import EmployeeWorkTab from "@/components/employees/tabs/EmployeeWorkTab";
import EmployeeBankTab from "@/components/employees/tabs/EmployeeBankTab";
import DocumentUploadForm from "@/components/employees/DocumentUploadForm";

interface EmployeeFormTabsProps {
  uiEmployeeData: any;
  bankDetails: any;
  onFormInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, checked: boolean) => void;
  onBankDetailsChange: (field: string, value: string) => void;
  onDocumentsChange: (documents: Record<string, string>) => void;
}

const EmployeeFormTabs: React.FC<EmployeeFormTabsProps> = ({
  uiEmployeeData,
  bankDetails,
  onFormInputChange,
  onSelectChange,
  onCheckboxChange,
  onBankDetailsChange,
  onDocumentsChange,
}) => {
  return (
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
          onInputChange={onFormInputChange}
          onSelectChange={onSelectChange}
          onCheckboxChange={onCheckboxChange}
        />
      </TabsContent>

      <TabsContent value="work">
        <EmployeeWorkTab 
          employee={uiEmployeeData}
          geofencingEnabled={false}
          onGeofencingToggle={() => {}}
          isEditMode={true}
          onInputChange={onFormInputChange}
          onSelectChange={onSelectChange}
        />
      </TabsContent>

      <TabsContent value="bank">
        <EmployeeBankTab 
          bankDetails={bankDetails}
          isEditMode={true}
          onBankDetailsChange={onBankDetailsChange}
        />
      </TabsContent>

      <TabsContent value="documents">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Employee Documents</h3>
            <DocumentUploadForm
              onDocumentsChange={onDocumentsChange}
              employeeId="temp-employee"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EmployeeFormTabs;
