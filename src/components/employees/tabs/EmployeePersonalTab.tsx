
import React from "react";
import { Label } from "@/components/ui/label";

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
}

const EmployeePersonalTab: React.FC<EmployeePersonalTabProps> = ({ employee }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Father's Name</Label>
          <p className="text-sm font-medium">{employee.fatherName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Name:</p>
          <p className="font-medium">{employee.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">DOB:</p>
          <p className="font-medium">{employee.dob}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Email:</p>
          <p className="font-medium">{employee.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Gender:</p>
          <p className="font-medium">{employee.gender}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Phone Number:</p>
          <p className="font-medium">{employee.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Address:</p>
          <p className="font-medium">{employee.address}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeePersonalTab;
