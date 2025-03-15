
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AttendanceCalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date;
  selectedEmployee: string | null;
  filterDepartment: string;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (day: number) => void;
  setSelectedEmployee: (value: string | null) => void;
  setFilterDepartment: (value: string) => void;
}

interface DayAttendance {
  present: number;
  absent: number;
  late: number;
  total: number;
}

const AttendanceCalendar = ({
  currentMonth,
  currentYear,
  selectedDate,
  selectedEmployee,
  filterDepartment,
  handlePrevMonth,
  handleNextMonth,
  handleDateClick,
  setSelectedEmployee,
  setFilterDepartment,
}: AttendanceCalendarProps) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate calendar days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    return calendarDays;
  };

  // Check if a day is the selected day
  const isSelectedDay = (day: number | null) => {
    if (!day) return false;
    
    const dateObj = new Date(currentYear, currentMonth, day);
    return dateObj.getDate() === selectedDate.getDate() &&
           dateObj.getMonth() === selectedDate.getMonth() &&
           dateObj.getFullYear() === selectedDate.getFullYear();
  };

  // Check if a day is today
  const isToday = (day: number | null) => {
    if (!day) return false;
    
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  // Get attendance data for a specific day (mocked data for now)
  const getDayAttendance = (day: number | null): DayAttendance | null => {
    if (!day) return null;
    
    // In actual implementation, this would fetch real data based on the date
    // This is a mock for the refactoring
    return {
      present: Math.floor(Math.random() * 25) + 5,
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 3),
      total: 28
    };
  };

  return (
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
        {/* Custom Calendar Implementation */}
        <div className="border rounded-md p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrevMonth}
            >
              &lt;
            </Button>
            <div className="text-lg font-medium">
              {months[currentMonth]} {currentYear}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNextMonth}
            >
              &gt;
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            <div className="text-xs font-medium text-gray-500">Sun</div>
            <div className="text-xs font-medium text-gray-500">Mon</div>
            <div className="text-xs font-medium text-gray-500">Tue</div>
            <div className="text-xs font-medium text-gray-500">Wed</div>
            <div className="text-xs font-medium text-gray-500">Thu</div>
            <div className="text-xs font-medium text-gray-500">Fri</div>
            <div className="text-xs font-medium text-gray-500">Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              const attendance = getDayAttendance(day);
              const isSelected = isSelectedDay(day);
              const todayClass = isToday(day) ? "border-blue-500 border-2" : "";
              
              return (
                <div 
                  key={index} 
                  className={`h-12 p-1 rounded-md ${day ? 'cursor-pointer hover:bg-gray-100' : ''} ${isSelected ? 'bg-blue-50' : ''} ${todayClass}`}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div className="text-xs text-center">{day}</div>
                      {attendance && attendance.total > 0 && (
                        <div className="flex justify-center mt-1 text-[8px] gap-1">
                          {attendance.present > 0 && <span className="text-green-600">{attendance.present}P</span>}
                          {attendance.absent > 0 && <span className="text-red-600">{attendance.absent}A</span>}
                          {attendance.late > 0 && <span className="text-yellow-600">{attendance.late}L</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
