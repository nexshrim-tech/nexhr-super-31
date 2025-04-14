
import React from "react";
import { TaskRemindersProps } from "@/types/components";

// This is a mock implementation to ensure the component accepts the correct props
const TaskReminders: React.FC<TaskRemindersProps> = ({
  customerId,
  isLoading
}) => {
  // This component is read-only, but we're ensuring it accepts the correct props
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Task Reminders</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading task reminders...</p>
      ) : (
        <p className="text-gray-600">No upcoming task reminders</p>
      )}
    </div>
  );
};

export default TaskReminders;
