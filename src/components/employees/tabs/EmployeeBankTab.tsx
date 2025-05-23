
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
}

interface EmployeeBankTabProps {
  employeeId: string;
  isEditMode?: boolean;
  onBankDetailsChange?: (field: string, value: string) => void;
}

const EmployeeBankTab: React.FC<EmployeeBankTabProps> = ({ 
  employeeId,
  isEditMode = false,
  onBankDetailsChange 
}) => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBankDetails = async () => {
      if (!employeeId) return;
      
      try {
        const { data, error } = await supabase
          .from('employeebankdetails')
          .select('*')
          .eq('employeeid', employeeId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching bank details:', error);
          return;
        }

        if (data) {
          setBankDetails({
            bankName: data.bankname || '',
            branchName: data.branchname || '',
            accountNumber: data.accountnumber || '',
            ifscCode: data.ifsccode || ''
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, [employeeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
    onBankDetailsChange && onBankDetailsChange(name, value);
  };

  if (loading) {
    return <div>Loading bank details...</div>;
  }

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
            <p className="text-sm font-medium">{bankDetails.bankName || 'Not specified'}</p>
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
            <p className="text-sm font-medium">{bankDetails.branchName || 'Not specified'}</p>
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
            <p className="text-sm font-medium">{bankDetails.accountNumber || 'Not specified'}</p>
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
            <p className="text-sm font-medium">{bankDetails.ifscCode || 'Not specified'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeBankTab;
