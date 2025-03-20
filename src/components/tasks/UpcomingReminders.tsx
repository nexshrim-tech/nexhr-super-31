
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import TaskCard from "./TaskCard";

const UpcomingReminders: React.FC = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-t-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Bell className="h-5 w-5 mr-2 text-orange-500" />
          Upcoming Reminders
          <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800 px-2">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskCard
          title="Schedule Performance Reviews"
          subtitle="Due in 2 days"
          badge="High"
          badgeColor="bg-red-100 text-red-800 border border-red-200"
          dueText=""
        />

        <TaskCard
          title="Team Meeting"
          subtitle="Today, 2:00 PM"
          badge="Medium"
          badgeColor="bg-yellow-100 text-yellow-800 border border-yellow-200"
          dueText=""
        />

        <TaskCard
          title="Review Leave Applications"
          subtitle="Due in 1 week"
          badge="Low"
          badgeColor="bg-green-100 text-green-800 border border-green-200"
          dueText=""
        />
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
