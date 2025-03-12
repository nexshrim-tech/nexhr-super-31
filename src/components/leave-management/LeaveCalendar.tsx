
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface LeaveCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const LeaveCalendar = ({ date, setDate }: LeaveCalendarProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;
