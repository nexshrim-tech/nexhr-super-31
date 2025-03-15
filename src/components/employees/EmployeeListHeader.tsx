
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Plus } from "lucide-react";

const EmployeeListHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">All Employees</h1>
        <p className="text-gray-500">Manage your organization's employees</p>
      </div>
      <div className="flex gap-2">
        <Link to="/add-employee">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </Link>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default EmployeeListHeader;
