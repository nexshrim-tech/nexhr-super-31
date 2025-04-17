
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EmployeeDetailsHeaderProps {
  employeeName?: string;
}

const EmployeeDetailsHeader: React.FC<EmployeeDetailsHeaderProps> = ({ employeeName }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {employeeName ? employeeName : 'Employee Details'}
        </h1>
        <p className="text-gray-500">Employee information</p>
      </div>
      <Link to="/all-employees">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>
    </div>
  );
};

export default EmployeeDetailsHeader;
