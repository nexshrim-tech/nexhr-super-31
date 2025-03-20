
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryItemProps {
  title: string;
  count: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, count }) => (
  <div className="border rounded-md p-4">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-medium">{count}</div>
  </div>
);

const TaskSummary: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Task Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SummaryItem title="Total Tasks" count={15} />
          <SummaryItem title="Completed" count={7} />
          <SummaryItem title="In Progress" count={5} />
          <SummaryItem title="To Do" count={3} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummary;
