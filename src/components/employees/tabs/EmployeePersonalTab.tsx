
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeePersonalTabProps {
  employee: {
    name: string;
    dob: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    fatherName: string;
    bloodGroup?: string;
    hasDisability?: boolean;
  };
  isEditMode: boolean;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange?: (field: string, value: string) => void;
  onCheckboxChange?: (field: string, checked: boolean) => void;
}

const EmployeePersonalTab: React.FC<EmployeePersonalTabProps> = ({ 
  employee, 
  isEditMode,
  onInputChange,
  onSelectChange,
  onCheckboxChange
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
          <Label>Blood Group</Label>
          {isEditMode ? (
            <Select 
              value={employee.bloodGroup || "unknown"} 
              onValueChange={(value) => onSelectChange && onSelectChange("bloodGroup", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm font-medium">{employee.bloodGroup || "Not specified"}</p>
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
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mt-2">
            {isEditMode ? (
              <Checkbox 
                id="hasDisability" 
                checked={employee.hasDisability || false}
                onCheckedChange={(checked) => onCheckboxChange && onCheckboxChange("hasDisability", checked as boolean)}
              />
            ) : (
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${employee.hasDisability ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                {employee.hasDisability ? "Person with disability" : "No disability disclosed"}
              </div>
            )}
            {isEditMode && (
              <Label htmlFor="hasDisability" className="font-medium text-gray-700">
                Person with disability
              </Label>
            )}
          </div>
          {isEditMode && (
            <p className="text-xs text-gray-500 pl-6 mt-1">
              This information is kept confidential and will only be used for inclusive workplace accommodations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePersonalTab;
