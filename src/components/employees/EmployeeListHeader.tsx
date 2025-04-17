
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmployeeListHeaderProps {
  onAddEmployee?: () => void;
}

const EmployeeListHeader: React.FC<EmployeeListHeaderProps> = ({ onAddEmployee }) => {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate("/add-employee");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">All Employees</h1>
        <p className="text-gray-500">Manage your organization's employees</p>
      </div>
      <div className="flex gap-2">
        <Button className="flex items-center gap-2" onClick={handleAddEmployee}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default EmployeeListHeader;
