
import React from 'react';
import { Employee } from "@/services/employeeService";
import DocumentUpdateDialog from "./DocumentUpdateDialog";
import EmployeeEditDialog from "./EmployeeEditDialog";
import PayslipDialog from "./PayslipDialog";
import PasswordChangeDialog from "./PasswordChangeDialog";
import OfficialDocumentsDialog from "./OfficialDocumentsDialog";

interface EmployeeDialogsProps {
  documentEditDialog: 'aadhar' | 'pan' | null;
  editDialogOpen: boolean;
  payslipDialogOpen: boolean;
  isPasswordDialogOpen: boolean;
  showOfficialDocsDialog: boolean;
  employee: Employee | null;
  adaptedEmployee: Employee;
  payslips: any[];
  onDocumentUpload: (type: 'aadhar' | 'pan') => void;
  onCloseDocumentDialog: () => void;
  setEditDialogOpen: (open: boolean) => void;
  setPayslipDialogOpen: (open: boolean) => void;
  setIsPasswordDialogOpen: (open: boolean) => void;
  setShowOfficialDocsDialog: (open: boolean) => void;
  onEditSave: () => void;
}

const EmployeeDialogs: React.FC<EmployeeDialogsProps> = ({
  documentEditDialog,
  editDialogOpen,
  payslipDialogOpen,
  isPasswordDialogOpen,
  showOfficialDocsDialog,
  employee,
  adaptedEmployee,
  payslips,
  onDocumentUpload,
  onCloseDocumentDialog,
  setEditDialogOpen,
  setPayslipDialogOpen,
  setIsPasswordDialogOpen,
  setShowOfficialDocsDialog,
  onEditSave,
}) => {
  return (
    <>
      <DocumentUpdateDialog 
        type={documentEditDialog}
        isOpen={documentEditDialog !== null}
        onClose={onCloseDocumentDialog}
        onUpload={onDocumentUpload}
      />

      <EmployeeEditDialog
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        employee={adaptedEmployee}
        onSave={onEditSave}
      />

      <PayslipDialog
        isOpen={payslipDialogOpen}
        onOpenChange={setPayslipDialogOpen}
        payslips={payslips}
      />

      <PasswordChangeDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        employee={adaptedEmployee}
      />

      <OfficialDocumentsDialog 
        isOpen={showOfficialDocsDialog}
        onClose={() => setShowOfficialDocsDialog(false)}
        employeeName={employee?.firstname ? `${employee.firstname} ${employee.lastname}` : ''}
      />
    </>
  );
};

export default EmployeeDialogs;
