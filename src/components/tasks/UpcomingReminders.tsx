
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";

const UpcomingReminders: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskCard
          title="Schedule Performance Reviews"
          subtitle="Due in 2 days"
          badge="High"
          badgeColor="bg-blue-50 text-blue-800"
          dueText=""
        />

        <TaskCard
          title="Team Meeting"
          subtitle="Today, 2:00 PM"
          badge="Medium"
          badgeColor="bg-yellow-50 text-yellow-800"
          dueText=""
        />

        <TaskCard
          title="Review Leave Applications"
          subtitle="Due in 1 week"
          badge="Low"
          badgeColor="bg-green-50 text-green-800"
          dueText=""
        />
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
