
import { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { getAttendanceForDate } from "@/services/attendance/attendanceService";

// Create attendance record update function
const updateAttendanceRecord = async (record: Partial<AttendanceRecord>) => {
  try {
    if (!record.employeeid || !record.customerid) {
      throw new Error("Employee ID and Customer ID are required");
    }
    
    const { error } = await supabase
      .from('attendance')
      .update({
        status: record.status,
        checkintime: record.checkintime,
        checkouttime: record.checkouttime,
        checkouttimestamp: record.checkouttimestamp,
        checkintimestamp: record.checkintimestamp,
      })
      .eq('employeeid', record.employeeid);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }
};

const AttendancePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const { toast } = useToast();
  
  // Get the current month's date range
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
  });

  // Get attendance data for the month
  const { data: monthlyAttendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['monthly-attendance', format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      const attendancePromises = daysInMonth.map(day => 
        getAttendanceForDate(format(day, 'yyyy-MM-dd'))
      );
      const results = await Promise.all(attendancePromises);
      return results.flat();
    },
  });

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getAttendanceForEmployeeAndDate = (employeeId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return monthlyAttendance.find(record => 
      record.employeeid === employeeId && 
      record.date === dateStr
    );
  };

  const renderAttendanceStatus = (status: string | undefined) => {
    if (!status) return null;
    
    let badgeClass = "";
    let displayText = status;
    
    switch (status.toLowerCase()) {
      case "present":
        badgeClass = "bg-green-400 text-white hover:bg-green-500";
        break;
      case "absent":
        badgeClass = "bg-red-100 text-red-800 hover:bg-red-200";
        break;
      case "late":
        badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        break;
      case "half day":
        badgeClass = "bg-purple-100 text-purple-800 hover:bg-purple-200";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
    
    return (
      <Badge className={`${badgeClass} text-xs px-2 py-1 rounded`}>
        {displayText}
      </Badge>
    );
  };

  const handleEditAttendance = (record: AttendanceRecord) => {
    setEditingRecord({
      ...record
    });
  };
  
  const handleSaveEditedRecord = (updatedRecord: Partial<AttendanceRecord>) => {
    updateAttendanceRecord(updatedRecord)
      .then(() => {
        toast({
          title: "Success",
          description: "Attendance record updated successfully",
        });
        setEditingRecord(null);
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to update attendance record",
          variant: "destructive",
        });
      });
  };

  if (employeesLoading || attendanceLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Attendance</CardTitle>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold min-w-[150px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Employee Report</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header row with dates */}
                <div className="grid grid-cols-[200px_repeat(auto-fit,_minmax(120px,_1fr))] gap-1 mb-4">
                  <div className="p-2 font-medium"></div>
                  {daysInMonth.map((date, index) => {
                    const dayName = format(date, 'EEEE');
                    const dayNumber = format(date, 'd');
                    return (
                      <div key={index} className="p-2 text-center border-b">
                        <div className="text-sm font-medium">{dayNumber} {dayName}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Employee rows */}
                {employees.map((employee) => (
                  <div key={employee.employeeid} className="grid grid-cols-[200px_repeat(auto-fit,_minmax(120px,_1fr))] gap-1 mb-2 border-b border-gray-100 py-2">
                    {/* Employee info */}
                    <div className="flex items-center gap-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={employee.profilepicturepath || ""} 
                          alt={`${employee.firstname} ${employee.lastname}`} 
                        />
                        <AvatarFallback>
                          {employee.firstname?.[0]}{employee.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {employee.firstname} {employee.lastname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.jobtitle || 'Employee'}
                        </div>
                      </div>
                    </div>

                    {/* Attendance status for each day */}
                    {daysInMonth.map((date, dateIndex) => {
                      const attendance = getAttendanceForEmployeeAndDate(employee.employeeid, date);
                      const isWeekend = getDay(date) === 0 || getDay(date) === 6;
                      
                      return (
                        <div 
                          key={dateIndex} 
                          className={`p-2 text-center ${isWeekend ? 'bg-gray-50' : ''}`}
                        >
                          {attendance ? (
                            renderAttendanceStatus(attendance.status)
                          ) : isWeekend ? (
                            <span className="text-gray-400 text-xs">Weekend</span>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendancePage;
