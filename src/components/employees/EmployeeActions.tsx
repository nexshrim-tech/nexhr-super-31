
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Key } from "lucide-react";

interface EmployeeActionsProps {
  onViewPayslips: () => void;
  onChangePassword: () => void;
  onViewOfficialDocs: () => void;
  employeeName: string;
}

const EmployeeActions: React.FC<EmployeeActionsProps> = ({
  onViewPayslips,
  onChangePassword,
  onViewOfficialDocs,
  employeeName
}) => {
  return (
    <div className="flex flex-wrap justify-between mt-8 mb-4 gap-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="gap-2" onClick={onViewPayslips}>
          <FileText className="h-4 w-4" />
          View Payslips
        </Button>
        <Button 
          variant="outline" 
          className="gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          onClick={onChangePassword}
        >
          <Key className="h-4 w-4" />
          Change Password
        </Button>
        <Button 
          variant="outline" 
          className="gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100"
          onClick={onViewOfficialDocs}
        >
          <FileText className="h-4 w-4" />
          Official Documents
        </Button>
      </div>
      {/* ConfirmDeleteDialog will be rendered here */}
    </div>
  );
};

export default EmployeeActions;
