
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { checkEmployeeIdExists } from '@/services/employeeValidationService';
import { useAuth } from '@/context/AuthContext';

interface EmployeeIdInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const EmployeeIdInput: React.FC<EmployeeIdInputProps> = ({
  value,
  onChange,
  onValidationChange
}) => {
  const { customerId, customerAuthId } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const newId = `EMP${timestamp}${random}`;
    onChange(newId);
  };

  const validateEmployeeId = async (employeeId: string) => {
    if (!employeeId.trim()) {
      setValidationStatus('idle');
      setValidationMessage('');
      onValidationChange(false);
      return;
    }

    const organizationId = customerId || customerAuthId;
    if (!organizationId) {
      console.error('No organization ID found for validation:', { customerId, customerAuthId });
      setValidationStatus('invalid');
      setValidationMessage('Unable to validate - customer not found');
      onValidationChange(false);
      return;
    }

    setIsChecking(true);
    setValidationStatus('checking');

    try {
      console.log('Validating employee ID:', { organizationId, employeeId });
      const exists = await checkEmployeeIdExists(organizationId, employeeId);

      if (exists) {
        setValidationStatus('invalid');
        setValidationMessage('This Employee ID already exists');
        onValidationChange(false);
      } else {
        setValidationStatus('valid');
        setValidationMessage('Employee ID is available');
        onValidationChange(true);
      }
    } catch (error) {
      console.error('Error validating employee ID:', error);
      setValidationStatus('invalid');
      setValidationMessage('Error validating Employee ID');
      onValidationChange(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        validateEmployeeId(value);
      } else {
        setValidationStatus('idle');
        setValidationMessage('');
        onValidationChange(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, customerId, customerAuthId]);

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="employeeId">Employee ID *</Label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            id="employeeId"
            name="employeeId"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter unique employee ID"
            className={`pr-10 ${
              validationStatus === 'valid' ? 'border-green-500' :
              validationStatus === 'invalid' ? 'border-red-500' : ''
            }`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={generateEmployeeId}
          disabled={isChecking}
        >
          Generate
        </Button>
      </div>
      {validationMessage && (
        <p className={`text-sm ${
          validationStatus === 'valid' ? 'text-green-600' : 'text-red-600'
        }`}>
          {validationMessage}
        </p>
      )}
    </div>
  );
};

export default EmployeeIdInput;
