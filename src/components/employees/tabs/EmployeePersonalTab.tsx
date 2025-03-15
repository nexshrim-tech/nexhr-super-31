
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EmployeePersonalTabProps {
  employee: {
    name: string;
    dob: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    fatherName: string;
  };
  isEditMode: boolean;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmployeePersonalTab: React.FC<EmployeePersonalTabProps> = ({ 
  employee, 
  isEditMode,
  onInputChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Father's Name</Label>
          {isEditMode ? (
            <Input 
              name="fatherName" 
              value={employee.fatherName || ""} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.fatherName}</p>
          )}
        </div>
        <div>
          <Label>Name</Label>
          {isEditMode ? (
            <Input 
              name="name" 
              value={employee.name} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.name}</p>
          )}
        </div>
        <div>
          <Label>Date of Birth</Label>
          {isEditMode ? (
            <Input 
              name="dob" 
              value={employee.dob} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.dob}</p>
          )}
        </div>
        <div>
          <Label>Email</Label>
          {isEditMode ? (
            <Input 
              name="email" 
              value={employee.email} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.email}</p>
          )}
        </div>
        <div>
          <Label>Gender</Label>
          {isEditMode ? (
            <Input 
              name="gender" 
              value={employee.gender} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.gender}</p>
          )}
        </div>
        <div>
          <Label>Phone Number</Label>
          {isEditMode ? (
            <Input 
              name="phone" 
              value={employee.phone} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.phone}</p>
          )}
        </div>
        <div>
          <Label>Address</Label>
          {isEditMode ? (
            <Input 
              name="address" 
              value={employee.address || ""} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.address}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePersonalTab;
