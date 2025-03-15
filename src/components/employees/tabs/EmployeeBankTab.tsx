
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EmployeeBankTabProps {
  bankDetails: {
    bankName: string;
    branchName: string;
    accountNumber: string;
    ifscCode: string;
  };
  isEditMode: boolean;
  onBankDetailsChange?: (field: string, value: string) => void;
}

const EmployeeBankTab: React.FC<EmployeeBankTabProps> = ({ 
  bankDetails, 
  isEditMode,
  onBankDetailsChange 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onBankDetailsChange && onBankDetailsChange(name, value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Bank Name</Label>
          {isEditMode ? (
            <Input 
              name="bankName" 
              value={bankDetails.bankName} 
              onChange={handleInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{bankDetails.bankName}</p>
          )}
        </div>
        <div>
          <Label>Branch Name</Label>
          {isEditMode ? (
            <Input 
              name="branchName" 
              value={bankDetails.branchName} 
              onChange={handleInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{bankDetails.branchName}</p>
          )}
        </div>
        <div>
          <Label>Account Number</Label>
          {isEditMode ? (
            <Input 
              name="accountNumber" 
              value={bankDetails.accountNumber} 
              onChange={handleInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{bankDetails.accountNumber}</p>
          )}
        </div>
        <div>
          <Label>IFSC Code</Label>
          {isEditMode ? (
            <Input 
              name="ifscCode" 
              value={bankDetails.ifscCode} 
              onChange={handleInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{bankDetails.ifscCode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeBankTab;
