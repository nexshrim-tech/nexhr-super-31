
import React from "react";
import { EmployeeListProps } from "@/types/components";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// This is a mock implementation to ensure the component accepts the correct props
const EmployeeList: React.FC<EmployeeListProps> = ({
  employees = [],
  isLoading = false,
  customerId
}) => {
  // This component is read-only, but we're ensuring it accepts the correct props
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Employee List</h3>
            {employees.length === 0 ? (
              <p className="text-gray-500">No employees found</p>
            ) : (
              <div>
                {employees.map((emp, index) => (
                  <div key={index} className="border-b py-2 last:border-none">
                    {emp.firstname} {emp.lastname}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
