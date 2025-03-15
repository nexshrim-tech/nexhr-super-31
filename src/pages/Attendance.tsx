import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/SidebarNav";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, MapPin, Camera } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Import refactored components
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceCalendar from "@/components/attendance/AttendanceCalendar";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import EditAttendanceDialog from "@/components/attendance/EditAttendanceDialog";
import AddAttendanceSheet from "@/components/attendance/AddAttendanceSheet";
import AttendancePhotos from "@/components/attendance/AttendancePhotos";
import AttendanceSettings from "@/components/attendance/AttendanceSettings";

// Import data
import { attendanceData, AttendanceRecord } from "@/data/attendanceData";

// Sample attendance photos
const sampleAttendancePhotos = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Olivia Rhye",
    date: new Date().toISOString().split('T')[0],
    checkInPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    checkOutPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    checkInTime: "09:05 AM",
    checkOutTime: "05:30 PM",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Phoenix Baker",
    date: new Date().toISOString().split('T')[0],
    checkInPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    checkOutPhoto: "",
    checkInTime: "08:55 AM",
    checkOutTime: "",
  },
];

// Sample holiday data
const holidayDates = [
  "2023-12-25", // Christmas
  "2024-01-01", // New Year
  new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0], // Random holiday this month
];

// Sample locations
const initialLocations = [
  {
    id: "loc1", 
    name: "Head Office",
    coordinates: [-74.006, 40.7128] // New York
  }
];

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  const [attendanceSettings, setAttendanceSettings] = useState({
    workStartTime: "09:00",
    lateThreshold: "09:30",
    enableGeofencing: true,
    defaultRadius: 250,
    requirePhoto: true,
    holidays: holidayDates.map(date => new Date(date)),
    locations: initialLocations,
  });
  const { toast } = useToast();

  // Check if today is a holiday
  const isTodayHoliday = attendanceSettings.holidays.some(date => 
    format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  // Rest of the functions remain the same
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

  const handleSaveSettings = (settings: any) => {
    setAttendanceSettings(settings);
    toast({
      title: "Settings updated",
      description: "Attendance settings have been updated successfully."
    });
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    // Check if the selected date is a holiday
    if (isTodayHoliday) {
      toast({
        title: "Holiday",
        description: "This day is marked as a holiday in the system.",
        variant: "default"
      });
    }
  }, [selectedDate]);

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <AttendanceHeader 
            handleExportReport={handleExportReport} 
            openAddAttendance={() => setIsAddAttendanceOpen(true)}
            openSettings={() => setIsSettingsOpen(true)}
          />

          <AttendanceStats 
            isHoliday={isTodayHoliday}
            holidayName={isTodayHoliday ? "Company Holiday" : undefined}
          />

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
              holidayDates={attendanceSettings.holidays}
            />
            
            <AttendanceTable 
              selectedDate={selectedDate}
              searchTerm={searchTerm}
              filteredRecords={filteredRecords}
              setSearchTerm={setSearchTerm}
              handleEditRecord={handleEditRecord}
            />

            <AttendancePhotos 
              photos={sampleAttendancePhotos}
              date={selectedDate}
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

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent className="sm:max-w-2xl overflow-auto">
          <SheetHeader>
            <SheetTitle>Attendance Settings</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <AttendanceSettings onSave={handleSaveSettings} />
          </div>
        </SheetContent>
      </Sheet>

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
