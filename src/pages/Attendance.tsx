import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Download, Filter, Search, Edit, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
];

const generateCalendarData = () => {
  const employees = [...new Set(attendanceData.map(record => record.employeeId))];
  const calendarData: Record<string, Record<string, string>> = {};
  
  employees.forEach(empId => {
    calendarData[empId] = {};
    
    const empRecords = attendanceData.filter(record => record.employeeId === empId);
    
    empRecords.forEach(record => {
      calendarData[empId][record.date] = record.status;
    });
  });
  
  return calendarData;
};

const calendarData = generateCalendarData();

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarView, setCalendarView] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    status: "",
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
    
    return matchesSearch && matchesDate && matchesEmployee;
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

  const renderDayContent = (props: { date: Date; displayMonth: Date }) => {
    const dateString = format(props.date, 'yyyy-MM-dd');
    const employees = Object.keys(calendarData);
    
    let present = 0;
    let absent = 0;
    let late = 0;
    
    employees.forEach(emp => {
      const status = calendarData[emp][dateString];
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Late') late++;
    });
    
    const total = present + absent + late;
    
    if (total === 0) return null;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div>{props.date.getDate()}</div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center text-[8px] gap-1">
          {present > 0 && <span className="text-green-600">{present}P</span>}
          {absent > 0 && <span className="text-red-600">{absent}A</span>}
          {late > 0 && <span className="text-yellow-600">{late}L</span>}
        </div>
      </div>
    );
  };

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
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
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
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <CardTitle>Attendance Calendar</CardTitle>
                  <div className="flex gap-3">
                    <Select 
                      value={selectedEmployee || ""} 
                      onValueChange={(value) => setSelectedEmployee(value || null)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Employees</SelectItem>
                        <SelectItem value="EMP001">Olivia Rhye</SelectItem>
                        <SelectItem value="EMP002">Phoenix Baker</SelectItem>
                        <SelectItem value="EMP003">Lana Steiner</SelectItem>
                        <SelectItem value="EMP004">Demi Wilkinson</SelectItem>
                        <SelectItem value="EMP005">Candice Wu</SelectItem>
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
                    className="mx-auto pointer-events-auto"
                    components={{
                      DayContent: renderDayContent
                    }}
                  />
                </div>
                
                {selectedDate && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Attendance for {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                    <div className="rounded-md border overflow-auto">
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
                              <TableCell>{record.checkIn || "-"}</TableCell>
                              <TableCell>{record.checkOut || "-"}</TableCell>
                              <TableCell>{renderAttendanceStatus(record.status)}</TableCell>
                              <TableCell>{record.workHours}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditRecord(record)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[160px] justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditRecord(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
                <SelectContent>
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
    </div>
  );
};

export default Attendance;
