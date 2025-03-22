
import React from "react";
import { Badge } from "@/components/ui/badge";

export interface EmployeeLocationProps {
  employee: {
    id: number;
    name: string;
    role: string;
    location: { lat: number; lng: number } | null;
    lastActive: string;
  };
  selected: boolean;
  onClick: () => void;
}

const EmployeeLocation: React.FC<EmployeeLocationProps> = ({ employee, selected, onClick }) => {
  return (
    <div
      className={`p-4 rounded-lg mb-2 cursor-pointer transition-colors ${
        selected ? "bg-primary/10 border border-primary/30" : "bg-gray-50 hover:bg-gray-100 border"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.role}</p>
        </div>
        <Badge variant={selected ? "default" : "outline"} className="ml-2">
          {employee.lastActive}
        </Badge>
      </div>
    </div>
  );
};

export default EmployeeLocation;
