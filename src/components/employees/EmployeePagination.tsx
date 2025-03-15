
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EmployeePaginationProps {
  filteredCount: number;
  totalCount: number;
}

const EmployeePagination: React.FC<EmployeePaginationProps> = ({
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">1</span> to{" "}
        <span className="font-medium">{filteredCount}</span> of{" "}
        <span className="font-medium">{totalCount}</span> employees
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-blue-50">
          1
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          2
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmployeePagination;
