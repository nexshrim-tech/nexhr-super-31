
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UserCheck } from "lucide-react";

const TodaysAttendance = () => {
  // Today's date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Sample attendance stats for today (you can replace with actual data)
  const presentCount = 8;
  const absentCount = 2;
  const lateCount = 1;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Attendance
        </CardTitle>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
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
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" size="sm" className="w-full gap-1">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
          <Button variant="outline" size="sm" className="w-full gap-1">
            <UserCheck className="h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAttendance;
