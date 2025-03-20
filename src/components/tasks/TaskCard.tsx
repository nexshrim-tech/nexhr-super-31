
import React from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  dueText: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  title, 
  subtitle, 
  badge, 
  badgeColor, 
  dueText 
}) => {
  const getPriorityIcon = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="bg-indigo-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{title}</div>
            <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${badgeColor}`}
          >
            {getPriorityIcon(badge)}
            {badge}
          </Badge>
          {dueText && <div className="text-xs text-gray-500">{dueText}</div>}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
