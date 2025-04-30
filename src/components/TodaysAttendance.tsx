import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAttendanceForDate, AttendanceRecord } from "@/services/attendance/attendanceService";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TodaysAttendance = () => {
  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
    late: 0
  });
  
  const { data: attendanceData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['attendance', formattedDate],
    queryFn: () => getAttendanceForDate(formattedDate),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Calculate attendance counts
    const presentCount = attendanceData.filter(record => record.status === 'Present').length;
    const absentCount = attendanceData.filter(record => record.status === 'Absent').length;
    const lateCount = attendanceData.filter(record => record.status === 'Late').length;
    
    setAttendanceCounts({
      present: presentCount,
      absent: absentCount,
      late: lateCount
    });
    
    // Set up real-time listener for attendance changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance'
        },
        (payload) => {
          // When attendance data changes, refetch the latest data
          refetch();
          toast.info("Attendance data updated");
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [attendanceData, refetch]);

  const handleExportReport = () => {
    toast.info("Generating attendance report...");
    // This would be implemented with actual export functionality
  };

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
              <div className="text-xl sm:text-2xl font-semibold text-green-600">{attendanceCounts.present}</div>
              <div className="text-xs text-green-700">Present</div>
            </div>
            <div className="bg-red-50 p-2 sm:p-3 rounded-md text-center">
              <div className="text-xl sm:text-2xl font-semibold text-red-600">{attendanceCounts.absent}</div>
              <div className="text-xs text-red-700">Absent</div>
            </div>
            <div className="bg-yellow-50 p-2 sm:p-3 rounded-md text-center">
              <div className="text-xl sm:text-2xl font-semibold text-yellow-600">{attendanceCounts.late}</div>
              <div className="text-xs text-yellow-700">Late</div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-1" 
            disabled={isLoading || !!error}
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
};

export default TodaysAttendance;
