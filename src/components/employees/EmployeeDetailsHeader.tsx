
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EmployeeDetailsHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">All Employees</h1>
        <p className="text-gray-500">Employee details</p>
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
