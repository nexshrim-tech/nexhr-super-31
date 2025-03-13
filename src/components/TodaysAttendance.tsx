
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, UserCheck } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TodaysAttendance = () => {
  // Today's date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Sample attendance stats for today (you can replace with actual data)
  const presentCount = 8;
  const absentCount = 2;
  const lateCount = 1;
  
  // State for current date
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Generate calendar days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

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

  const handlePrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const handleDateClick = (day: number | null) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day);
      setDate(newDate);
      setShowCalendar(false);
    }
  };

  // Check if a day is the selected day
  const isSelectedDay = (day: number | null) => {
    if (!day) return false;
    
    const dateObj = new Date(currentYear, currentMonth, day);
    return dateObj.getDate() === date.getDate() &&
           dateObj.getMonth() === date.getMonth() &&
           dateObj.getFullYear() === date.getFullYear();
  };

  // Check if a day is today
  const isToday = (day: number | null) => {
    if (!day) return false;
    
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Today's Attendance
        </CardTitle>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-50 p-2 sm:p-3 rounded-md text-center">
            <div className="text-xl sm:text-2xl font-semibold text-green-600">{presentCount}</div>
            <div className="text-xs text-green-700">Present</div>
          </div>
          <div className="bg-red-50 p-2 sm:p-3 rounded-md text-center">
            <div className="text-xl sm:text-2xl font-semibold text-red-600">{absentCount}</div>
            <div className="text-xs text-red-700">Absent</div>
          </div>
          <div className="bg-yellow-50 p-2 sm:p-3 rounded-md text-center">
            <div className="text-xl sm:text-2xl font-semibold text-yellow-600">{lateCount}</div>
            <div className="text-xs text-yellow-700">Late</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(date, 'PP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 pointer-events-auto" align="start">
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
                <div className="text-xs font-medium text-gray-500">Su</div>
                <div className="text-xs font-medium text-gray-500">Mo</div>
                <div className="text-xs font-medium text-gray-500">Tu</div>
                <div className="text-xs font-medium text-gray-500">We</div>
                <div className="text-xs font-medium text-gray-500">Th</div>
                <div className="text-xs font-medium text-gray-500">Fr</div>
                <div className="text-xs font-medium text-gray-500">Sa</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  const isSelected = isSelectedDay(day);
                  const todayClass = isToday(day) ? "border-blue-500 border-2" : "";
                  
                  return (
                    <div 
                      key={index} 
                      className={`h-8 w-8 flex items-center justify-center rounded-md ${day ? 'cursor-pointer hover:bg-gray-100' : ''} ${isSelected ? 'bg-blue-50' : ''} ${todayClass}`}
                      onClick={() => day && handleDateClick(day)}
                    >
                      {day && (
                        <div className="text-xs">{day}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="w-full gap-1">
            <UserCheck className="h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAttendance;
