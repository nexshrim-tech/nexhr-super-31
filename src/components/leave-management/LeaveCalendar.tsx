
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LeaveCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const LeaveCalendar = ({ date, setDate }: LeaveCalendarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="rounded-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Calendar</CardTitle>
      </CardHeader>
      <CardContent className={`p-0 ${isMobile ? 'overflow-x-auto' : ''}`}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className={`rounded-md ${isMobile ? 'w-full min-w-[300px]' : 'w-full'}`}
        />
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;
