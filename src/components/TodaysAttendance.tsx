
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAttendanceForDate } from "@/services/attendance/attendanceService";
import { useQuery } from "@tanstack/react-query";

const TodaysAttendance = () => {
  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');
  
  const { data: attendanceData = [], isLoading, error } = useQuery({
    queryKey: ['attendance', formattedDate],
    queryFn: () => getAttendanceForDate(formattedDate),
    // Add error handling and fallback
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const presentCount = attendanceData.filter(record => record.status === 'Present').length || 0;
  const absentCount = attendanceData.filter(record => record.status === 'Absent').length || 0;
  const lateCount = attendanceData.filter(record => record.status === 'Late').length || 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Today's Attendance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 text-sm mb-4">
            Failed to load attendance data. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-50 p-2 sm:p-3 rounded-md text-center">
              <div className="text-xl sm:text-2xl font-semibold text-green-600">{presentCount}</div>
              <div className="text-xs text-green-700">Present</div>
            </div>
            <div className="bg-red-50 p-2 sm:p-3 rounded-md text-center">
              <div className="text-xl sm:text-2xl font-semibold text-red-600">{absentCount}</div>
              <div className="text-xs text-red-700">Absent</div>
            </div>
            <div className="bg-yellow-50 p-2 sm:p-3 rounded-md text-center">
              <div className="text-xl sm:text-2xl font-semibold text-yellow-600">{lateCount}</div>
              <div className="text-xs text-yellow-700">Late</div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" size="sm" className="w-full gap-1" disabled={isLoading || !!error}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAttendance;
