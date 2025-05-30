
import { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { getAttendanceForDate } from "@/services/attendance/attendanceService";
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";

const AttendancePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
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
  const { data: monthlyAttendance = [], isLoading: attendanceLoading, refetch } = useQuery({
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
    if (!status) return <span className="text-gray-300 text-xs">-</span>;
    
    const statusConfig = {
      present: { class: "bg-green-500 text-white", text: "P" },
      absent: { class: "bg-red-500 text-white", text: "A" },
      late: { class: "bg-yellow-500 text-white", text: "L" },
      "half day": { class: "bg-blue-500 text-white", text: "H" },
      holiday: { class: "bg-purple-500 text-white", text: "HO" },
    };
    
    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || 
                  { class: "bg-gray-500 text-white", text: "?" };
    
    return (
      <Badge className={`${config.class} text-xs px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center`}>
        {config.text}
      </Badge>
    );
  };

  // Filter employees based on selected filters
  const filteredEmployees = employees.filter(employee => {
    if (selectedEmployee !== "all" && employee.employeeid !== selectedEmployee) return false;
    return true;
  });

  // Calculate attendance statistics
  const attendanceStats = {
    totalEmployees: employees.length,
    presentToday: monthlyAttendance.filter(record => 
      record.date === format(new Date(), 'yyyy-MM-dd') && record.status === 'present'
    ).length,
    absentToday: monthlyAttendance.filter(record => 
      record.date === format(new Date(), 'yyyy-MM-dd') && record.status === 'absent'
    ).length,
    lateToday: monthlyAttendance.filter(record => 
      record.date === format(new Date(), 'yyyy-MM-dd') && record.status === 'late'
    ).length,
  };

  const handleExportReport = () => {
    toast({
      title: "Export Report",
      description: "Attendance report exported successfully",
    });
  };

  const openAddAttendance = () => {
    toast({
      title: "Add Attendance",
      description: "Add attendance dialog opened",
    });
  };

  const openSettings = () => {
    toast({
      title: "Settings",
      description: "Attendance settings opened",
    });
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId === "all" ? "all" : employeeId);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === "all" ? "all" : status);
  };

  if (employeesLoading || attendanceLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading attendance data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <AttendanceHeader 
          handleExportReport={handleExportReport}
          openAddAttendance={openAddAttendance}
          openSettings={openSettings}
        />

        <AttendanceStats 
          totalEmployees={attendanceStats.totalEmployees}
          presentToday={attendanceStats.presentToday}
          absentToday={attendanceStats.absentToday}
          lateToday={attendanceStats.lateToday}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AttendanceFilters
                  employees={employees}
                  selectedEmployee={selectedEmployee}
                  selectedStatus={selectedStatus}
                  onEmployeeChange={handleEmployeeChange}
                  onStatusChange={handleStatusChange}
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">View Mode</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === "calendar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("calendar")}
                    >
                      Calendar
                    </Button>
                    <Button 
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      Table
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Legend</label>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center">P</Badge>
                      Present
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center">A</Badge>
                      Absent
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center">L</Badge>
                      Late
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center">H</Badge>
                      Half Day
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Attendance Overview
                  </CardTitle>
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
              </CardHeader>
              <CardContent>
                {viewMode === "calendar" ? (
                  <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                      {/* Header row with dates */}
                      <div className="grid grid-cols-[200px_repeat(31,_minmax(40px,_1fr))] gap-1 mb-4">
                        <div className="p-2 font-medium text-sm">Employee</div>
                        {daysInMonth.map((date, index) => {
                          const dayName = format(date, 'EEE');
                          const dayNumber = format(date, 'd');
                          const isWeekend = getDay(date) === 0 || getDay(date) === 6;
                          return (
                            <div key={index} className={`p-1 text-center border-b ${isWeekend ? 'bg-gray-50' : ''}`}>
                              <div className="text-xs font-medium">{dayNumber}</div>
                              <div className="text-[10px] text-gray-500">{dayName}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Employee rows */}
                      {filteredEmployees.map((employee) => (
                        <div key={employee.employeeid} className="grid grid-cols-[200px_repeat(31,_minmax(40px,_1fr))] gap-1 mb-2 border-b border-gray-100 py-2 hover:bg-gray-50">
                          {/* Employee info */}
                          <div className="flex items-center gap-2 p-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={employee.profilepicturepath || ""} 
                                alt={`${employee.firstname} ${employee.lastname}`} 
                              />
                              <AvatarFallback className="text-xs">
                                {employee.firstname?.[0]}{employee.lastname?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">
                                {employee.firstname} {employee.lastname}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
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
                                className={`p-1 flex justify-center items-center ${isWeekend ? 'bg-gray-50' : ''}`}
                              >
                                {attendance ? (
                                  renderAttendanceStatus(attendance.status)
                                ) : isWeekend ? (
                                  <span className="text-gray-400 text-xs">-</span>
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Table view implementation coming soon...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;
