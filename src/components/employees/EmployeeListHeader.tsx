
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, Filter } from "lucide-react";

const EmployeeListHeader = () => {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate("/add-employee");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
        <p className="text-gray-600">Manage your organization's workforce</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button 
          onClick={handleAddEmployee}
          className="bg-nexhr-primary hover:bg-nexhr-primary/90 text-white flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>
    </div>
  );
};

export default EmployeeListHeader;
