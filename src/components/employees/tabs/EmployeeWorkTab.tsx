
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EmployeeWorkTabProps {
  employee: {
    department: string;
    role: string;
    employeeId: string;
    joining: string;
  };
  geofencingEnabled: boolean;
  onGeofencingToggle: (checked: boolean) => void;
}

const EmployeeWorkTab: React.FC<EmployeeWorkTabProps> = ({ 
  employee, 
  geofencingEnabled, 
  onGeofencingToggle 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          <p className="text-sm font-medium">{employee.department}</p>
        </div>
        <div>
          <Label>Role</Label>
          <p className="text-sm font-medium">{employee.role}</p>
        </div>
        <div>
          <Label>Employee ID</Label>
          <p className="text-sm font-medium">{employee.employeeId}</p>
        </div>
        <div>
          <Label>Joining Date</Label>
          <p className="text-sm font-medium">{employee.joining}</p>
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
