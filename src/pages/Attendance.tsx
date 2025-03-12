
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, Filter, UserCheck, Edit, CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const attendanceData = [
  {
    id: 1,
    employee: { id: "EMP001", name: "Olivia Rhye", avatar: "OR" },
    date: "2023-08-01",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "9h 00m",
  },
  {
    id: 2,
    employee: { id: "EMP002", name: "Phoenix Baker", avatar: "PB" },
    date: "2023-08-01",
    checkIn: "09:15 AM",
    checkOut: "06:30 PM",
    status: "Present",
    workHours: "9h 15m",
  },
  {
    id: 3,
    employee: { id: "EMP003", name: "Lana Steiner", avatar: "LS" },
    date: "2023-08-01",
    checkIn: "08:45 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 45m",
  },
  {
    id: 4,
    employee: { id: "EMP004", name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-08-01",
    checkIn: "--:--",
    checkOut: "--:--",
    status: "Absent",
    workHours: "0h 00m",
  },
  {
    id: 5,
    employee: { id: "EMP005", name: "Candice Wu", avatar: "CW" },
    date: "2023-08-01",
    checkIn: "10:00 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workHours: "8h 00m",
  },
  {
    id: 6,
    employee: { id: "EMP006", name: "Natali Craig", avatar: "NC" },
    date: "2023-08-01",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "9h 00m",
  },
  {
    id: 7,
    employee: { id: "EMP007", name: "Drew Cano", avatar: "DC" },
    date: "2023-08-01",
    checkIn: "09:30 AM",
    checkOut: "06:30 PM",
    status: "Present",
    workHours: "9h 00m",
  },
];

// Generate dummy calendar data for visualization
const generateCalendarData = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const data = {};
  for (let day = 1; day <= endDate.getDate(); day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const random = Math.random();
    let status;
    
    if (random > 0.9) {
      status = "absent";
    } else if (random > 0.8) {
      status = "late";
    } else {
      status = "present";
    }
    
    data[format(date, 'yyyy-MM-dd')] = status;
  }
  
  return data;
};

const calendarData = generateCalendarData();

const Attendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    status: ""
  });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("daily");

  // Handler for opening the edit dialog
  const handleOpenEditDialog = (record) => {
    setCurrentRecord(record);
    setEditForm({
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status
    });
    setIsEditDialogOpen(true);
  };

  // Handler for editing attendance record
  const handleEditAttendance = () => {
    // In a real app, this would update the database
    toast({
      title: "Attendance record updated",
      description: `Updated attendance record for ${currentRecord.employee.name}`,
    });
    setIsEditDialogOpen(false);
  };

  // Custom day rendering for calendar with attendance status
  const handleDayClick = (day: Date) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    toast({
      title: "Attendance for " + format(day, 'PPP'),
      description: `Status: ${calendarData[formattedDate] || 'No record'}`,
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Attendance Management</h1>
              <p className="text-gray-500">Manage and track employee attendance</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{
                      present: (date) => calendarData[format(date, 'yyyy-MM-dd')] === 'present',
                      absent: (date) => calendarData[format(date, 'yyyy-MM-dd')] === 'absent',
                      late: (date) => calendarData[format(date, 'yyyy-MM-dd')] === 'late',
                    }}
                    modifiersStyles={{
                      present: { backgroundColor: '#d1fae5', color: '#059669' },
                      absent: { backgroundColor: '#fee2e2', color: '#dc2626' },
                      late: { backgroundColor: '#fef3c7', color: '#d97706' },
                    }}
                    onDayClick={handleDayClick}
                  />
                  <div className="mt-4 flex gap-2 justify-center">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-green-200 rounded-full"></div>
                      <span className="text-xs">Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-red-200 rounded-full"></div>
                      <span className="text-xs">Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-yellow-200 rounded-full"></div>
                      <span className="text-xs">Late</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <UserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Present</div>
                        <div className="font-medium">87%</div>
                      </div>
                    </div>
                    <div className="text-lg font-medium">26</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 p-2 rounded-full">
                        <UserCheck className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Absent</div>
                        <div className="font-medium">7%</div>
                      </div>
                    </div>
                    <div className="text-lg font-medium">2</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Late</div>
                        <div className="font-medium">6%</div>
                      </div>
                    </div>
                    <div className="text-lg font-medium">2</div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full">Mark Attendance</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-base">Attendance Records</CardTitle>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                          <TabsTrigger value="daily">Daily</TabsTrigger>
                          <TabsTrigger value="weekly">Weekly</TabsTrigger>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Select>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Employee</TableHead>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Work Hours</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceData.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="" alt={record.employee.name} />
                                  <AvatarFallback>{record.employee.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{record.employee.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{record.employee.id}</TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.checkIn}</TableCell>
                            <TableCell>{record.checkOut}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  record.status === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "Late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.workHours}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleOpenEditDialog(record)}
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
            </div>
          </div>
        </div>
      </div>

      {/* Edit Attendance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update attendance information for {currentRecord?.employee?.name}
            </DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editForm.date}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          setEditForm(prev => ({
                            ...prev,
                            date: date ? format(date, 'yyyy-MM-dd') : prev.date
                          }));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkIn" className="text-right">
                  Check In
                </Label>
                <Input
                  id="checkIn"
                  value={editForm.checkIn}
                  onChange={(e) => setEditForm(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOut" className="text-right">
                  Check Out
                </Label>
                <Input
                  id="checkOut"
                  value={editForm.checkOut}
                  onChange={(e) => setEditForm(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAttendance}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
