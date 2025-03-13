
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Download, Filter, Search, Edit, Calendar as CalendarIcon, FileText, UserPlus, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const attendanceData = [
  {
    id: 1,
    employeeId: "EMP001",
    employee: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-06-01",
    checkIn: "09:05 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 25m",
    notes: "",
  },
  {
    id: 2,
    employeeId: "EMP002",
    employee: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-06-01",
    checkIn: "08:55 AM",
    checkOut: "06:15 PM",
    status: "Present",
    workHours: "9h 20m",
    notes: "Worked on Project X deadline",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employee: { name: "Lana Steiner", avatar: "LS" },
    date: "2023-06-01",
    checkIn: "",
    checkOut: "",
    status: "Absent",
    workHours: "-",
    notes: "Sick leave",
  },
  {
    id: 4,
    employeeId: "EMP004",
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-06-01",
    checkIn: "09:30 AM",
    checkOut: "04:45 PM",
    status: "Present",
    workHours: "7h 15m",
    notes: "Left early - doctor appointment",
  },
  {
    id: 5,
    employeeId: "EMP005",
    employee: { name: "Candice Wu", avatar: "CW" },
    date: "2023-06-01",
    checkIn: "10:15 AM",
    checkOut: "06:30 PM",
    status: "Late",
    workHours: "8h 15m",
    notes: "Traffic delay",
  },
  {
    id: 6,
    employeeId: "EMP001",
    employee: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-06-02",
    checkIn: "09:00 AM",
    checkOut: "05:15 PM",
    status: "Present",
    workHours: "8h 15m",
    notes: "",
  },
  {
    id: 7,
    employeeId: "EMP002",
    employee: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-06-02",
    checkIn: "08:50 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 40m",
    notes: "",
  },
  // Add today's date records to show data when clicking on current day
  {
    id: 8,
    employeeId: "EMP001",
    employee: { name: "Olivia Rhye", avatar: "OR" },
    date: format(new Date(), 'yyyy-MM-dd'),
    checkIn: "08:55 AM",
    checkOut: "05:15 PM",
    status: "Present",
    workHours: "8h 20m",
    notes: "",
  },
  {
    id: 9,
    employeeId: "EMP002",
    employee: { name: "Phoenix Baker", avatar: "PB" },
    date: format(new Date(), 'yyyy-MM-dd'),
    checkIn: "09:05 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 25m",
    notes: "",
  },
  {
    id: 10,
    employeeId: "EMP003",
    employee: { name: "Lana Steiner", avatar: "LS" },
    date: format(new Date(), 'yyyy-MM-dd'),
    checkIn: "",
    checkOut: "",
    status: "Absent",
    workHours: "-",
    notes: "Sick leave",
  },
];

interface DayContentProps {
  date: Date; 
  displayMonth: Date;
}

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarView, setCalendarView] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [currentRecord, setCurrentRecord] = useState<any>(null);
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
  const { toast } = useToast();

  const filteredRecords = attendanceData.filter(record => {
    const matchesSearch = 
      record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate 
      ? record.date === format(selectedDate, 'yyyy-MM-dd') 
      : true;
    
    const matchesEmployee = selectedEmployee 
      ? record.employeeId === selectedEmployee 
      : true;
    
    const matchesDepartment = filterDepartment !== "all" 
      ? true
      : true;
    
    return matchesSearch && matchesDate && matchesEmployee && matchesDepartment;
  });

  const handleEditRecord = (record: any) => {
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
      description: `Attendance record for ${currentRecord.employee.name} has been updated.`
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
    toast({
      title: "Report generated",
      description: "Attendance report has been generated and is ready for download."
    });
  };

  const renderAttendanceStatus = (status: string) => {
    let badgeClass = "";
    
    switch (status.toLowerCase()) {
      case "present":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "absent":
        badgeClass = "bg-red-100 text-red-800";
        break;
      case "late":
        badgeClass = "bg-yellow-100 text-yellow-800";
        break;
      case "half day":
        badgeClass = "bg-purple-100 text-purple-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }
    
    return <Badge className={badgeClass}>{status}</Badge>;
  };

  const renderDayContent = ({ date, displayMonth }: DayContentProps) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const employees = [...new Set(attendanceData.map(record => record.employeeId))];
    
    let present = 0;
    let absent = 0;
    let late = 0;
    
    employees.forEach(emp => {
      const records = attendanceData.filter(r => r.employeeId === emp && r.date === dateString);
      if (records.length > 0) {
        const status = records[0].status;
        if (status === 'Present') present++;
        else if (status === 'Absent') absent++;
        else if (status === 'Late') late++;
      }
    });
    
    const total = present + absent + late;
    
    if (total === 0) return null;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div>{date.getDate()}</div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center text-[8px] gap-1">
          {present > 0 && <span className="text-green-600">{present}P</span>}
          {absent > 0 && <span className="text-red-600">{absent}A</span>}
          {late > 0 && <span className="text-yellow-600">{late}L</span>}
        </div>
      </div>
    );
  };

  const dateSelectedRecords = selectedDate 
    ? filteredRecords.filter(record => record.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Attendance Management</h1>
              <p className="text-gray-500">Track employee attendance and hours</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setCalendarView(!calendarView)}
              >
                <CalendarIcon className="h-4 w-4" />
                {calendarView ? "List View" : "Calendar View"}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button className="flex items-center gap-2" onClick={() => setIsAddAttendanceOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Add Attendance
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-600">24</div>
                <p className="text-sm text-gray-500">Out of 28 employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Absent Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-red-600">2</div>
                <p className="text-sm text-gray-500">7.1% of workforce</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-yellow-600">2</div>
                <p className="text-sm text-gray-500">7.1% of workforce</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Avg. Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">8h 15m</div>
                <p className="text-sm text-gray-500">+5% from last week</p>
              </CardContent>
            </Card>
          </div>

          {calendarView ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <CardTitle>Attendance Calendar</CardTitle>
                    <div className="flex flex-col gap-3">
                      <Select 
                        value={selectedEmployee || "all"} 
                        onValueChange={(value) => setSelectedEmployee(value === "all" ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Employees" />
                        </SelectTrigger>
                        <SelectContent className="pointer-events-auto">
                          <SelectItem value="all">All Employees</SelectItem>
                          <SelectItem value="EMP001">Olivia Rhye</SelectItem>
                          <SelectItem value="EMP002">Phoenix Baker</SelectItem>
                          <SelectItem value="EMP003">Lana Steiner</SelectItem>
                          <SelectItem value="EMP004">Demi Wilkinson</SelectItem>
                          <SelectItem value="EMP005">Candice Wu</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={filterDepartment} 
                        onValueChange={setFilterDepartment}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent className="pointer-events-auto">
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="mx-auto"
                      components={{
                        DayContent: renderDayContent
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {selectedDate ? (
                        `Attendance for ${format(selectedDate, 'MMMM d, yyyy')}`
                      ) : (
                        "Attendance Records"
                      )}
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search employees..."
                        className="pl-8 w-[200px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-auto max-h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dateSelectedRecords.length > 0 ? dateSelectedRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="" alt={record.employee.name} />
                                  <AvatarFallback>{record.employee.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{record.employee.name}</div>
                                  <div className="text-xs text-gray-500">{record.employeeId}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{record.checkIn || "-"}</TableCell>
                            <TableCell>{record.checkOut || "-"}</TableCell>
                            <TableCell>{renderAttendanceStatus(record.status)}</TableCell>
                            <TableCell>{record.workHours}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditRecord(record)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                              No attendance records found for selected date
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <CardTitle>Attendance Records</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] pointer-events-auto">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Department</Label>
                              <Select 
                                value={filterDepartment} 
                                onValueChange={setFilterDepartment}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent className="pointer-events-auto">
                                  <SelectItem value="all">All Departments</SelectItem>
                                  <SelectItem value="engineering">Engineering</SelectItem>
                                  <SelectItem value="design">Design</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="sales">Sales</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select defaultValue="all">
                                <SelectTrigger>
                                  <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="pointer-events-auto">
                                  <SelectItem value="all">All Status</SelectItem>
                                  <SelectItem value="present">Present</SelectItem>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="late">Late</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button className="w-full">Apply Filters</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[160px] justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt={record.employee.name} />
                                <AvatarFallback>{record.employee.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{record.employee.name}</div>
                                <div className="text-xs text-gray-500">{record.employeeId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.checkIn || "-"}</TableCell>
                          <TableCell>{record.checkOut || "-"}</TableCell>
                          <TableCell>{renderAttendanceStatus(record.status)}</TableCell>
                          <TableCell>{record.workHours}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              {record.notes || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditRecord(record)}
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              {currentRecord?.employee?.name} • {currentRecord?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check In Time</Label>
                <Input
                  id="checkIn"
                  value={editFormData.checkIn}
                  onChange={(e) => setEditFormData({...editFormData, checkIn: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check Out Time</Label>
                <Input
                  id="checkOut"
                  value={editFormData.checkOut}
                  onChange={(e) => setEditFormData({...editFormData, checkOut: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Attendance Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => setEditFormData({...editFormData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="pointer-events-auto">
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                placeholder="Add any additional notes here"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isAddAttendanceOpen} onOpenChange={setIsAddAttendanceOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Attendance Record</SheetTitle>
            <SheetDescription>
              Create a new attendance record for an employee
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select 
                value={newAttendanceData.employeeId} 
                onValueChange={(value) => setNewAttendanceData({...newAttendanceData, employeeId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="pointer-events-auto">
                  <SelectItem value="EMP001">Olivia Rhye</SelectItem>
                  <SelectItem value="EMP002">Phoenix Baker</SelectItem>
                  <SelectItem value="EMP003">Lana Steiner</SelectItem>
                  <SelectItem value="EMP004">Demi Wilkinson</SelectItem>
                  <SelectItem value="EMP005">Candice Wu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newAttendanceData.date || "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(newAttendanceData.date)}
                    onSelect={(date) => setNewAttendanceData({
                      ...newAttendanceData, 
                      date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check In</Label>
                <Input
                  id="checkIn"
                  value={newAttendanceData.checkIn}
                  onChange={(e) => setNewAttendanceData({...newAttendanceData, checkIn: e.target.value})}
                  placeholder="09:00 AM"
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check Out</Label>
                <Input
                  id="checkOut"
                  value={newAttendanceData.checkOut}
                  onChange={(e) => setNewAttendanceData({...newAttendanceData, checkOut: e.target.value})}
                  placeholder="05:00 PM"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newAttendanceData.status}
                onValueChange={(value) => setNewAttendanceData({...newAttendanceData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="pointer-events-auto">
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newAttendanceData.notes}
                onChange={(e) => setNewAttendanceData({...newAttendanceData, notes: e.target.value})}
                placeholder="Add any additional notes here"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddAttendanceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAttendance}>
              Save Record
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Attendance;
