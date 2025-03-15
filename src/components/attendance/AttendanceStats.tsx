
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  color?: string;
}

const StatCard = ({ title, value, subtext, color }: StatCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-semibold ${color || ""}`}>{value}</div>
      <p className="text-sm text-gray-500">{subtext}</p>
    </CardContent>
  </Card>
);

interface AttendanceStatsProps {
  isHoliday?: boolean;
  holidayName?: string;
}

const AttendanceStats = ({ isHoliday, holidayName }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {isHoliday ? (
        <Card className="md:col-span-4 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-blue-600">Holiday Today</h3>
                <p className="text-blue-700">{holidayName || "Official Holiday"}</p>
              </div>
              <div className="text-3xl text-blue-500">🎉</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <StatCard
            title="Present Today"
            value="24"
            subtext="Out of 28 employees"
            color="text-green-600"
          />
          <StatCard
            title="Absent Today"
            value="2"
            subtext="7.1% of workforce"
            color="text-red-600"
          />
          <StatCard
            title="Late Arrivals"
            value="2"
            subtext="7.1% of workforce"
            color="text-yellow-600"
          />
          <StatCard
            title="Avg. Working Hours"
            value="8h 15m"
            subtext="+5% from last week"
          />
        </>
      )}
    </div>
  );
};

export default AttendanceStats;
