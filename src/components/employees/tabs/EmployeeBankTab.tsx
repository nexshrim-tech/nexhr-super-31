
import React from "react";
import { Label } from "@/components/ui/label";

interface EmployeeBankTabProps {
  bankDetails: {
    bankName: string;
    branchName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

const EmployeeBankTab: React.FC<EmployeeBankTabProps> = ({ bankDetails }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Bank Name</Label>
          <p className="text-sm font-medium">{bankDetails.bankName}</p>
        </div>
        <div>
          <Label>Branch Name</Label>
          <p className="text-sm font-medium">{bankDetails.branchName}</p>
        </div>
        <div>
          <Label>Account Number</Label>
          <p className="text-sm font-medium">{bankDetails.accountNumber}</p>
        </div>
        <div>
          <Label>IFSC Code</Label>
          <p className="text-sm font-medium">{bankDetails.ifscCode}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBankTab;
