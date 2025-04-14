
import React from "react";
import { TodaysAttendanceProps } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TodaysAttendance: React.FC<TodaysAttendanceProps> = ({
  customerId,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No attendance records for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysAttendance;
