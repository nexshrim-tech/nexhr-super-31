import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarRange, Settings } from "lucide-react";

// Import components
import AttendanceCalendar from "@/components/attendance/AttendanceCalendar";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendancePhotos from "@/components/attendance/AttendancePhotos";
import EditAttendanceDialog from "@/components/attendance/EditAttendanceDialog";
import AttendanceSettings from "@/components/attendance/AttendanceSettings";
import TodaysAttendance from "@/components/TodaysAttendance";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [currentTab, setCurrentTab] = useState("overview");
  const [editFormData, setEditFormData] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    status: "",
    notes: "",
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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          {/* Header with tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-2 sm:mb-0">Attendance Management</h1>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Main tabs */}
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <TodaysAttendance 
                customerId={null} 
                isLoading={false} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AttendanceCalendar 
                  currentMonth={selectedDate.getMonth()}
                  currentYear={selectedDate.getFullYear()}
                  selectedDate={selectedDate}
                  selectedEmployee={selectedEmployee}
                  filterDepartment={filterDepartment}
                  handlePrevMonth={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                  handleNextMonth={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                  handleDateClick={(day) => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
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
              </div>
            </TabsContent>

            {/* Records Tab */}
            <TabsContent value="records" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div className="flex items-center">
                  <CalendarRange className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-lg font-medium">
                    Attendance for {format(selectedDate, 'MMMM yyyy')}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <AttendanceTable 
                  selectedDate={selectedDate}
                  searchTerm={searchTerm}
                  filteredRecords={filteredRecords}
                  setSearchTerm={setSearchTerm}
                  handleEditRecord={handleEditRecord}
                />
              </div>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium">
                    Attendance Photos for {format(selectedDate, 'MMMM d, yyyy')}
                  </h2>
                </div>
              </div>
              <AttendancePhotos 
                photos={sampleAttendancePhotos}
                date={selectedDate}
              />
            </TabsContent>
          </Tabs>
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
    </div>
  );
};

export default Attendance;
