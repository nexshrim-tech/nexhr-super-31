
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

const AttendanceStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
    </div>
  );
};

export default AttendanceStats;
