
import { Button } from "@/components/ui/button";
import { RefreshCcw, ChevronDown, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TaskReminders = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">Task & reminders</CardTitle>
          <Badge variant="outline" className="rounded-full bg-blue-50 text-nexhr-primary px-2 py-0">
            2
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-nexhr-primary" />
              <div>
                <div className="font-medium">Schedule Performance Reviews</div>
                <div className="text-sm text-muted-foreground">4 review pending scheduling</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-100">
                2 on going
              </Badge>
              <div className="text-xs text-muted-foreground">Due this month</div>
            </div>
          </div>
        </div>
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-nexhr-primary" />
              <div>
                <div className="font-medium">Plan interview sessions</div>
                <div className="text-sm text-muted-foreground">Schedule and plan interview sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-500">
                ASAP
              </Badge>
              <div className="text-xs text-muted-foreground">Due this month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskReminders;
