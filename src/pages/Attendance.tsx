import { useState, useEffect } from "react";
import { Layout } from "@/components/ui/layout";
import { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, TrendingUp, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { getAttendanceForDate, createAttendanceRecord, setupAttendanceSubscription } from "@/services/attendance/attendanceService";
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AddAttendanceSheet from "@/components/attendance/AddAttendanceSheet";
import ExportDialog from "@/components/attendance/ExportDialog";
import AttendanceSettingsDialog from "@/components/attendance/AttendanceSettingsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";

const AttendancePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [newAttendanceData, setNewAttendanceData] = useState({
    employeeId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: "",
    checkOut: "",
    status: "",
    notes: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  // Set up real-time subscription for attendance changes
  useEffect(() => {
    const channel = setupAttendanceSubscription();
    
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendance'
      },
      (payload) => {
        console.log('Attendance data changed:', payload);
        
        // Invalidate and refetch attendance data
        queryClient.invalidateQueries({ queryKey: ['monthly-attendance'] });
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
        
        // Show toast notification
        if (payload.eventType === 'INSERT') {
          toast({
            title: "New Attendance Record",
            description: "A new attendance record has been added",
          });
        } else if (payload.eventType === 'UPDATE') {
          toast({
            title: "Attendance Updated",
            description: "An attendance record has been updated",
          });
        }
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, toast]);

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
      present: { class: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm", text: "P" },
      absent: { class: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm", text: "A" },
      late: { class: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm", text: "L" },
      "half day": { class: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm", text: "H" },
      holiday: { class: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm", text: "HO" },
    };
    
    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || 
                  { class: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm", text: "?" };
    
    return (
      <Badge className={`${config.class} text-xs px-2 py-1 rounded-full min-w-[28px] h-7 flex items-center justify-center font-medium transition-all duration-200 hover:scale-105`}>
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
    setIsExportDialogOpen(true);
  };

  const handleExportConfirm = () => {
    if (exportDateRange?.from && exportDateRange?.to) {
      // Create CSV data
      const csvData = monthlyAttendance
        .filter(record => {
          const recordDate = new Date(record.date || '');
          return recordDate >= exportDateRange.from! && recordDate <= exportDateRange.to!;
        })
        .map(record => {
          const employee = employees.find(emp => emp.employeeid === record.employeeid);
          return {
            'Employee Name': employee ? `${employee.firstname} ${employee.lastname}` : 'Unknown',
            'Employee ID': record.employeeid,
            'Date': record.date,
            'Check In': record.checkintime || '-',
            'Check Out': record.checkouttime || '-',
            'Status': record.status || 'Not Marked',
            'Work Hours': record.workhours || '-'
          };
        });

      // Convert to CSV string
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${format(exportDateRange.from, 'yyyy-MM-dd')}-to-${format(exportDateRange.to, 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setIsExportDialogOpen(false);
      toast({
        title: "Export Successful",
        description: "Attendance report has been downloaded",
      });
    }
  };

  const openAddAttendance = () => {
    setIsAddAttendanceOpen(true);
  };

  const handleAddAttendance = async () => {
    try {
      console.log("Adding attendance:", newAttendanceData);
      
      await createAttendanceRecord(newAttendanceData);
      
      setIsAddAttendanceOpen(false);
      setNewAttendanceData({
        employeeId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        checkIn: "",
        checkOut: "",
        status: "",
        notes: "",
      });
      
      toast({
        title: "Attendance Added",
        description: "New attendance record has been created",
      });
      
      // The real-time subscription will automatically update the data
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast({
        title: "Error",
        description: "Failed to add attendance record",
        variant: "destructive",
      });
    }
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (settings: any) => {
    console.log("Saving settings:", settings);
    toast({
      title: "Settings Saved",
      description: "Attendance settings have been updated",
    });
    setIsSettingsOpen(false);
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId === "all" ? "all" : employeeId);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === "all" ? "all" : status);
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    toast({
      title: "Edit Record",
      description: "Edit functionality is handled in table view",
    });
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
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
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
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filters & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <AttendanceFilters
                  employees={employees}
                  selectedEmployee={selectedEmployee}
                  selectedStatus={selectedStatus}
                  onEmployeeChange={handleEmployeeChange}
                  onStatusChange={handleStatusChange}
                />
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">View Mode</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === "calendar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("calendar")}
                      className="flex-1 transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Calendar
                    </Button>
                    <Button 
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="flex-1 transition-all duration-200"
                    >
                      <TableIcon className="h-4 w-4 mr-1" />
                      Table
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Status Legend</label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-medium">P</Badge>
                      <span className="text-gray-600">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-medium">A</Badge>
                      <span className="text-gray-600">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-medium">L</Badge>
                      <span className="text-gray-600">Late</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-medium">H</Badge>
                      <span className="text-gray-600">Half Day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {viewMode === "table" ? (
              <AttendanceTable
                selectedDate={currentDate}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEditRecord={handleEditRecord}
              />
            ) : (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      Attendance Calendar
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={handlePrevMonth}
                        className="bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-lg font-semibold min-w-[150px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                      </h2>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={handleNextMonth}
                        className="bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-200"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <div className="min-w-[900px] bg-gradient-to-b from-gray-50 to-white">
                      {/* Header row with dates */}
                      <div className="grid grid-cols-[220px_repeat(31,_minmax(45px,_1fr))] gap-1 mb-2 bg-gradient-to-r from-slate-100 to-gray-100 p-3 sticky top-0 z-10">
                        <div className="p-3 font-semibold text-sm text-gray-700 bg-white rounded-lg shadow-sm">Employee</div>
                        {daysInMonth.map((date, index) => {
                          const dayName = format(date, 'EEE');
                          const dayNumber = format(date, 'd');
                          const isWeekend = getDay(date) === 0 || getDay(date) === 6;
                          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                          return (
                            <div key={index} className={`p-2 text-center rounded-lg transition-all duration-200 ${
                              isToday ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md' :
                              isWeekend ? 'bg-gradient-to-b from-orange-100 to-orange-200 text-orange-800' : 
                              'bg-white text-gray-700 shadow-sm hover:shadow-md'
                            }`}>
                              <div className="text-sm font-semibold">{dayNumber}</div>
                              <div className="text-[10px] opacity-80">{dayName}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Employee rows */}
                      <div className="p-3 space-y-2">
                        {filteredEmployees.map((employee, empIndex) => (
                          <div key={employee.employeeid} className={`grid grid-cols-[220px_repeat(31,_minmax(45px,_1fr))] gap-1 p-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                            empIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                          } border border-gray-100 hover:border-blue-200`}>
                            {/* Employee info */}
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                                <AvatarImage 
                                  src={employee.profilepicturepath || ""} 
                                  alt={`${employee.firstname} ${employee.lastname}`} 
                                />
                                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                  {employee.firstname?.[0]}{employee.lastname?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-sm text-gray-800 truncate">
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
                              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                              
                              return (
                                <div 
                                  key={dateIndex} 
                                  className={`p-2 flex justify-center items-center rounded-lg transition-all duration-200 ${
                                    isToday ? 'bg-blue-100 ring-2 ring-blue-300' :
                                    isWeekend ? 'bg-orange-50' : 
                                    'hover:bg-gray-50'
                                  }`}
                                >
                                  {attendance ? (
                                    renderAttendanceStatus(attendance.status)
                                  ) : isWeekend ? (
                                    <span className="text-orange-400 text-xs font-medium">—</span>
                                  ) : (
                                    <span className="text-gray-300 text-xs">—</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Add Attendance Sheet */}
        <AddAttendanceSheet
          isOpen={isAddAttendanceOpen}
          onOpenChange={setIsAddAttendanceOpen}
          newAttendanceData={newAttendanceData}
          setNewAttendanceData={setNewAttendanceData}
          handleAddAttendance={handleAddAttendance}
        />

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Attendance Settings</DialogTitle>
            </DialogHeader>
            <AttendanceSettingsDialog onSave={handleSaveSettings} />
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Attendance Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export attendance data for the selected date range as a CSV file.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExportConfirm}>
                  Export CSV
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AttendancePage;
