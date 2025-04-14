
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      attendance: true,
      leaveRequests: true,
      documentApprovals: true,
      taskAssignments: false,
      projectUpdates: true,
      helpDeskTickets: true,
    },
    inApp: {
      attendance: true,
      leaveRequests: true,
      documentApprovals: true,
      taskAssignments: true,
      projectUpdates: true,
      helpDeskTickets: true,
    }
  });

  const handleToggleChange = (category: 'email' | 'inApp', key: string) => {
    setNotifications({
      ...notifications,
      [category]: {
        ...notifications[category],
        [key]: !notifications[category][key as keyof typeof notifications[typeof category]],
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your notification preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const NotificationItem = ({ 
    category, 
    title, 
    description, 
    name 
  }: { 
    category: 'email' | 'inApp', 
    title: string, 
    description: string, 
    name: string 
  }) => (
    <div className="flex items-start justify-between space-y-2">
      <div className="space-y-0.5">
        <Label className="text-base">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={notifications[category][name as keyof typeof notifications[typeof category]]}
        onCheckedChange={() => handleToggleChange(category, name)}
        aria-label={`Toggle ${title}`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage the email notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            category="email"
            title="Attendance"
            description="Receive notifications about attendance records and updates"
            name="attendance"
          />
          <Separator />
          <NotificationItem
            category="email"
            title="Leave Requests"
            description="Receive notifications when leave requests are submitted or updated"
            name="leaveRequests"
          />
          <Separator />
          <NotificationItem
            category="email"
            title="Document Approvals"
            description="Receive notifications for document approval requests"
            name="documentApprovals"
          />
          <Separator />
          <NotificationItem
            category="email"
            title="Task Assignments"
            description="Receive notifications when tasks are assigned to you"
            name="taskAssignments"
          />
          <Separator />
          <NotificationItem
            category="email"
            title="Project Updates"
            description="Receive notifications about project updates and changes"
            name="projectUpdates"
          />
          <Separator />
          <NotificationItem
            category="email"
            title="Help Desk Tickets"
            description="Receive notifications about help desk ticket updates"
            name="helpDeskTickets"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Manage the in-app notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            category="inApp"
            title="Attendance"
            description="Receive in-app notifications about attendance records and updates"
            name="attendance"
          />
          <Separator />
          <NotificationItem
            category="inApp"
            title="Leave Requests"
            description="Receive in-app notifications when leave requests are submitted or updated"
            name="leaveRequests"
          />
          <Separator />
          <NotificationItem
            category="inApp"
            title="Document Approvals"
            description="Receive in-app notifications for document approval requests"
            name="documentApprovals"
          />
          <Separator />
          <NotificationItem
            category="inApp"
            title="Task Assignments"
            description="Receive in-app notifications when tasks are assigned to you"
            name="taskAssignments"
          />
          <Separator />
          <NotificationItem
            category="inApp"
            title="Project Updates"
            description="Receive in-app notifications about project updates and changes"
            name="projectUpdates"
          />
          <Separator />
          <NotificationItem
            category="inApp"
            title="Help Desk Tickets"
            description="Receive in-app notifications about help desk ticket updates"
            name="helpDeskTickets"
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
