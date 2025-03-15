
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface AttendanceCalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date;
  selectedEmployee: string | null;
  filterDepartment: string;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (day: number) => void;
  setSelectedEmployee: (employee: string | null) => void;
  setFilterDepartment: (department: string) => void;
  holidayDates: Date[];
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
  holidayDates
}: AttendanceCalendarProps) => {
  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Arrays for week days
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Create empty slots for days before the 1st of the month
    const startingBlanks = Array.from({ length: firstDay }, (_, i) => (
      <div key={`blank-${i}`} className="h-12 md:h-14 flex items-center justify-center text-gray-400"></div>
    ));
    
    // Create calendar days
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const currentDate = new Date(currentYear, currentMonth, day);
      const isSelected = day === selectedDate.getDate() && 
                        currentMonth === selectedDate.getMonth() && 
                        currentYear === selectedDate.getFullYear();
      const isToday = day === new Date().getDate() && 
                    currentMonth === new Date().getMonth() && 
                    currentYear === new Date().getFullYear();
      
      // Check if this day is a holiday
      const isHoliday = holidayDates.some(date => 
        date.getDate() === day && 
        date.getMonth() === currentMonth && 
        date.getFullYear() === currentYear
      );
      
      return (
        <div 
          key={`day-${day}`} 
          className={`h-12 md:h-14 flex flex-col items-center justify-center cursor-pointer transition-colors rounded-lg
                    ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                    ${isToday && !isSelected ? 'border border-primary' : ''}
                    ${isHoliday ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}
                    `}
          onClick={() => handleDateClick(day)}
        >
          <span className="text-sm md:text-base">{day}</span>
          {isHoliday && (
            <span className="text-[10px] md:text-xs mt-0.5">Holiday</span>
          )}
        </div>
      );
    });
    
    return { weekdays, days: [...startingBlanks, ...calendarDays] };
  };
  
  const { weekdays, days } = generateCalendarDays();
  
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-24 text-center">
              {format(new Date(currentYear, currentMonth), "MMMM yyyy")}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {days}
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select 
                value={selectedEmployee || "all"} 
                onValueChange={(value) => setSelectedEmployee(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="EMP001">Olivia Rhye</SelectItem>
                  <SelectItem value="EMP002">Phoenix Baker</SelectItem>
                  <SelectItem value="EMP003">Lana Steiner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              <Select 
                value={filterDepartment} 
                onValueChange={setFilterDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;
