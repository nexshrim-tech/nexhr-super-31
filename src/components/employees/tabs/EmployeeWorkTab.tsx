
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeeWorkTabProps {
  employee: {
    department: string;
    role: string;
    employeeId: string;
    joining: string;
    employmenttype?: string;
    workAuthorization?: string;
    probationEndDate?: string;
    employmentHistory?: string;
  };
  geofencingEnabled: boolean;
  onGeofencingToggle: (checked: boolean) => void;
  isEditMode: boolean;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange?: (field: string, value: string) => void;
}

const EmployeeWorkTab: React.FC<EmployeeWorkTabProps> = ({ 
  employee, 
  geofencingEnabled, 
  onGeofencingToggle,
  isEditMode,
  onInputChange,
  onSelectChange
}) => {
  const departmentValue = employee.department ? employee.department.toLowerCase() : '';
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          {isEditMode ? (
            <Select 
              value={departmentValue} 
              onValueChange={(value) => onSelectChange && onSelectChange("department", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm font-medium">{employee.department}</p>
          )}
        </div>
        <div>
          <Label>Role</Label>
          {isEditMode ? (
            <Input 
              name="role" 
              value={employee.role} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.role}</p>
          )}
        </div>
        <div>
          <Label>Employee ID</Label>
          {isEditMode ? (
            <Input 
              name="employeeId" 
              value={employee.employeeId} 
              onChange={onInputChange} 
              className="mt-1"
              readOnly
            />
          ) : (
            <p className="text-sm font-medium">{employee.employeeId}</p>
          )}
        </div>
        <div>
          <Label>Joining Date</Label>
          {isEditMode ? (
            <Input 
              type="date"
              name="joining" 
              value={employee.joining} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.joining}</p>
          )}
        </div>
        <div>
          <Label>Employee Type</Label>
          {isEditMode ? (
            <Select 
              value={employee.employmenttype || ""} 
              onValueChange={(value) => onSelectChange && onSelectChange("employmenttype", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select employee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
                <SelectItem value="Probation">Probation</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm font-medium">{employee.employmenttype || "Not specified"}</p>
          )}
        </div>
        <div>
          <Label>Work Authorization</Label>
          {isEditMode ? (
            <Input 
              name="workAuthorization" 
              value={employee.workAuthorization || ""} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.workAuthorization || "Not specified"}</p>
          )}
        </div>
        <div>
          <Label>Probation End Date</Label>
          {isEditMode ? (
            <Input 
              type="date"
              name="probationEndDate" 
              value={employee.probationEndDate || ""} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.probationEndDate || "Not applicable"}</p>
          )}
        </div>
        <div className="col-span-2">
          <Label>Employment History</Label>
          {isEditMode ? (
            <Input 
              name="employmentHistory" 
              value={employee.employmentHistory || ""} 
              onChange={onInputChange} 
              className="mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{employee.employmentHistory || "Not specified"}</p>
          )}
        </div>
        <div className="col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <Label>Geofencing</Label>
              <p className="text-sm text-muted-foreground">Enable or disable location tracking</p>
            </div>
            <Switch
              checked={geofencingEnabled}
              onCheckedChange={onGeofencingToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWorkTab;
