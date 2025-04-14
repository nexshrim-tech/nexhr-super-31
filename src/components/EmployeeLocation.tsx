
import React from "react";
import { EmployeeLocationProps } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeLocation: React.FC<EmployeeLocationProps> = ({
  customerId,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Employee Locations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
            <p className="text-gray-500">Location data will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeLocation;
