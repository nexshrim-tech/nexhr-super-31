
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfilePhotoUpload from "@/components/employees/ProfilePhotoUpload";
import EmployeeIdInput from "@/components/employees/EmployeeIdInput";

interface EmployeeBasicInfoFormProps {
  employeeData: any;
  employeeEmail: string;
  employeePassword: string;
  isEmployeeIdValid: boolean;
  onEmployeeIdChange: (id: string) => void;
  onEmployeeIdValidationChange: (isValid: boolean) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onProfilePhotoUpload: (photoUrl: string) => void;
}

const EmployeeBasicInfoForm: React.FC<EmployeeBasicInfoFormProps> = ({
  employeeData,
  employeeEmail,
  employeePassword,
  isEmployeeIdValid,
  onEmployeeIdChange,
  onEmployeeIdValidationChange,
  onEmailChange,
  onPasswordChange,
  onProfilePhotoUpload,
}) => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b">
        <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
        <ProfilePhotoUpload
          onPhotoUpload={onProfilePhotoUpload}
          currentPhoto={employeeData.profilepicturepath}
          employeeName={`${employeeData.firstname || ''} ${employeeData.lastname || ''}`.trim() || 'New Employee'}
        />
      </div>

      <div className="pb-6 border-b">
        <h3 className="text-lg font-medium mb-4">Employee Identification</h3>
        <EmployeeIdInput
          value={employeeData.employeeid || ''}
          onChange={onEmployeeIdChange}
          onValidationChange={onEmployeeIdValidationChange}
        />
      </div>

      <div className="pb-6 border-b">
        <h3 className="text-lg font-medium mb-4">Authentication Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeEmail">Employee Email</Label>
            <Input
              id="employeeEmail"
              type="email"
              value={employeeEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Employee login email"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email address for employee to login
            </p>
          </div>
          <div>
            <Label htmlFor="employeePassword">Employee Password</Label>
            <Input
              id="employeePassword"
              type="password"
              value={employeePassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Initial password for employee (they can change it later)
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-amber-600">
              <strong>Note:</strong> Leave these fields empty if you don't want to create a login account for this employee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBasicInfoForm;
