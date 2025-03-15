
import React, { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/SidebarNav";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

// Import refactored components
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceCalendar from "@/components/attendance/AttendanceCalendar";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import EditAttendanceDialog from "@/components/attendance/EditAttendanceDialog";
import AddAttendanceSheet from "@/components/attendance/AddAttendanceSheet";

// Import data
import { attendanceData, AttendanceRecord } from "@/data/attendanceData";

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    status: "",
    notes: "",
  });
  const [newAttendanceData, setNewAttendanceData] = useState({
    employeeId: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    checkIn: "",
    checkOut: "",
    status: "Present",
    notes: "",
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const { toast } = useToast();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
    }
  };

  const filteredRecords = attendanceData.filter(record => {
    const matchesSearch = 
      record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = record.date === format(selectedDate, 'yyyy-MM-dd');
    
    const matchesEmployee = selectedEmployee 
      ? record.employeeId === selectedEmployee 
      : true;
    
    const matchesDepartment = filterDepartment !== "all" 
      ? true // In a real app, you would check the department
      : true;
    
    return matchesSearch && matchesDate && matchesEmployee && matchesDepartment;
  });

  const handleEditRecord = (record: AttendanceRecord) => {
    setCurrentRecord(record);
    setEditFormData({
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      notes: record.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Record updated",
      description: `Attendance record for ${currentRecord?.employee.name} has been updated.`
    });
    setIsEditDialogOpen(false);
  };

  const handleAddAttendance = () => {
    toast({
      title: "Attendance added",
      description: "New attendance record has been added successfully."
    });
    setIsAddAttendanceOpen(false);
    setNewAttendanceData({
      employeeId: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      checkIn: "",
      checkOut: "",
      status: "Present",
      notes: "",
    });
  };

  const handleExportReport = () => {
    setIsExportDialogOpen(true);
  };

  const handleExport = () => {
    if (dateRange?.from && dateRange?.to) {
      toast({
        title: "Report generated",
        description: `Attendance report has been generated from ${format(dateRange.from, 'PP')} to ${format(dateRange.to, 'PP')}`
      });
      setIsExportDialogOpen(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <AttendanceHeader 
            handleExportReport={handleExportReport} 
            openAddAttendance={() => setIsAddAttendanceOpen(true)} 
          />

          <AttendanceStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AttendanceCalendar 
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDate={selectedDate}
              selectedEmployee={selectedEmployee}
              filterDepartment={filterDepartment}
              handlePrevMonth={handlePrevMonth}
              handleNextMonth={handleNextMonth}
              handleDateClick={handleDateClick}
              setSelectedEmployee={setSelectedEmployee}
              setFilterDepartment={setFilterDepartment}
            />
            
            <AttendanceTable 
              selectedDate={selectedDate}
              searchTerm={searchTerm}
              filteredRecords={filteredRecords}
              setSearchTerm={setSearchTerm}
              handleEditRecord={handleEditRecord}
            />
          </div>
        </div>
      </div>

      <EditAttendanceDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentRecord={currentRecord}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleSaveEdit={handleSaveEdit}
      />

      <AddAttendanceSheet 
        isOpen={isAddAttendanceOpen}
        onOpenChange={setIsAddAttendanceOpen}
        newAttendanceData={newAttendanceData}
        setNewAttendanceData={setNewAttendanceData}
        handleAddAttendance={handleAddAttendance}
      />

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Attendance Records</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">Select Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
