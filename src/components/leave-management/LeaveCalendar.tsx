
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface LeaveCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const LeaveCalendar = ({ date, setDate }: LeaveCalendarProps) => {
  return (
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
  );
};

export default LeaveCalendar;
