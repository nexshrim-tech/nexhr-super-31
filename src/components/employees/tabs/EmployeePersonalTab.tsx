
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeePersonalTabProps {
  employee: {
    name: string;
    firstname?: string;
    lastname?: string;
    dob: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    fatherName: string;
    city?: string;
    state?: string;
    country?: string;
    postalcode?: string;
    bloodGroup?: string;
    bloodgroup?: string;
    hasDisability?: boolean;
    maritalstatus?: string;
    nationality?: string;
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
  const bloodGroupValue = employee.bloodGroup || employee.bloodgroup || "unknown";
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          {isEditMode ? (
            <Input 
              name="firstname" 
              value={employee.firstname || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter first name"
            />
          ) : (
            <p className="text-sm font-medium">{employee.firstname}</p>
          )}
        </div>
        <div>
          <Label>Last Name</Label>
          {isEditMode ? (
            <Input 
              name="lastname" 
              value={employee.lastname || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter last name"
            />
          ) : (
            <p className="text-sm font-medium">{employee.lastname}</p>
          )}
        </div>
        <div>
          <Label>Father's Name</Label>
          {isEditMode ? (
            <Input 
              name="fatherName" 
              value={employee.fatherName || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter father's name"
            />
          ) : (
            <p className="text-sm font-medium">{employee.fatherName}</p>
          )}
        </div>
        <div>
          <Label>Date of Birth</Label>
          {isEditMode ? (
            <Input 
              type="date"
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
              type="email"
              value={employee.email} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter email address"
            />
          ) : (
            <p className="text-sm font-medium">{employee.email}</p>
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
              placeholder="Enter phone number"
            />
          ) : (
            <p className="text-sm font-medium">{employee.phone}</p>
          )}
        </div>
        <div>
          <Label>Gender</Label>
          {isEditMode ? (
            <Select 
              value={employee.gender || ""} 
              onValueChange={(value) => onSelectChange && onSelectChange("gender", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm font-medium">{employee.gender}</p>
          )}
        </div>
        <div>
          <Label>Blood Group</Label>
          {isEditMode ? (
            <Select 
              value={bloodGroupValue} 
              onValueChange={(value) => onSelectChange && onSelectChange("bloodgroup", value)}
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
            <p className="text-sm font-medium">{bloodGroupValue !== "unknown" ? bloodGroupValue : "Not specified"}</p>
          )}
        </div>
        <div>
          <Label>Marital Status</Label>
          {isEditMode ? (
            <Select 
              value={employee.maritalstatus || "Single"} 
              onValueChange={(value) => onSelectChange && onSelectChange("maritalstatus", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm font-medium">{employee.maritalstatus || "Single"}</p>
          )}
        </div>
        <div>
          <Label>Nationality</Label>
          {isEditMode ? (
            <Input 
              name="nationality" 
              value={employee.nationality || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter nationality"
            />
          ) : (
            <p className="text-sm font-medium">{employee.nationality || "Not specified"}</p>
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
              placeholder="Enter address"
            />
          ) : (
            <p className="text-sm font-medium">{employee.address}</p>
          )}
        </div>
        <div>
          <Label>City</Label>
          {isEditMode ? (
            <Input 
              name="city" 
              value={employee.city || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter city"
            />
          ) : (
            <p className="text-sm font-medium">{employee.city || "Not specified"}</p>
          )}
        </div>
        <div>
          <Label>State/Province</Label>
          {isEditMode ? (
            <Input 
              name="state" 
              value={employee.state || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter state/province"
            />
          ) : (
            <p className="text-sm font-medium">{employee.state || "Not specified"}</p>
          )}
        </div>
        <div>
          <Label>Country</Label>
          {isEditMode ? (
            <Input 
              name="country" 
              value={employee.country || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter country"
            />
          ) : (
            <p className="text-sm font-medium">{employee.country || "Not specified"}</p>
          )}
        </div>
        <div>
          <Label>Postal Code</Label>
          {isEditMode ? (
            <Input 
              name="postalcode" 
              value={employee.postalcode || ""} 
              onChange={onInputChange} 
              className="mt-1"
              placeholder="Enter postal code"
            />
          ) : (
            <p className="text-sm font-medium">{employee.postalcode || "Not specified"}</p>
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
