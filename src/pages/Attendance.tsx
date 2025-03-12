
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, Filter, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const attendanceData = [
  {
    id: 1,
    employee: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-08-01",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "9h 00m",
  },
  {
    id: 2,
    employee: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-08-01",
    checkIn: "09:15 AM",
    checkOut: "06:30 PM",
    status: "Present",
    workHours: "9h 15m",
  },
  {
    id: 3,
    employee: { name: "Lana Steiner", avatar: "LS" },
    date: "2023-08-01",
    checkIn: "08:45 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 45m",
  },
  {
    id: 4,
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-08-01",
    checkIn: "--:--",
    checkOut: "--:--",
    status: "Absent",
    workHours: "0h 00m",
  },
  {
    id: 5,
    employee: { name: "Candice Wu", avatar: "CW" },
    date: "2023-08-01",
    checkIn: "10:00 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workHours: "8h 00m",
  },
  {
    id: 6,
    employee: { name: "Natali Craig", avatar: "NC" },
    date: "2023-08-01",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "9h 00m",
  },
  {
    id: 7,
    employee: { name: "Drew Cano", avatar: "DC" },
    date: "2023-08-01",
    checkIn: "09:30 AM",
    checkOut: "06:30 PM",
    status: "Present",
    workHours: "9h 00m",
  },
];

const Attendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
                  />
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
                      <Tabs defaultValue="daily">
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
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Employee</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Work Hours</TableHead>
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
    </div>
  );
};

export default Attendance;
