
import React from "react";
import { Calendar } from "lucide-react";
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
  return (
    <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Calendar className="h-5 w-5 text-nexhr-primary" />
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={badgeColor}
          >
            {badge}
          </Badge>
          <div className="text-xs text-muted-foreground">{dueText}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
