
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const initialLeaveApplications = [
  {
    id: 1,
    employee: { name: "Olivia Rhye", avatar: "OR" },
    type: "Annual Leave",
    startDate: "2023-08-15",
    endDate: "2023-08-20",
    duration: "5 days",
    status: "Approved",
  },
  {
    id: 2,
    employee: { name: "Phoenix Baker", avatar: "PB" },
    type: "Sick Leave",
    startDate: "2023-08-10",
    endDate: "2023-08-11",
    duration: "2 days",
    status: "Pending",
  },
  {
    id: 3,
    employee: { name: "Lana Steiner", avatar: "LS" },
    type: "Personal Leave",
    startDate: "2023-08-25",
    endDate: "2023-08-26",
    duration: "2 days",
    status: "Pending",
  },
  {
    id: 4,
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    type: "Maternity Leave",
    startDate: "2023-09-01",
    endDate: "2023-12-01",
    duration: "3 months",
    status: "Approved",
  },
  {
    id: 5,
    employee: { name: "Candice Wu", avatar: "CW" },
    type: "Annual Leave",
    startDate: "2023-08-05",
    endDate: "2023-08-07",
    duration: "3 days",
    status: "Rejected",
  },
];

const LeaveManagement = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [leaveApplications, setLeaveApplications] = useState(initialLeaveApplications);
  const { toast } = useToast();

  const handleApproveLeave = (id: number) => {
    setLeaveApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === id ? { ...app, status: "Approved" } : app
      )
    );
    toast({
      title: "Leave Approved",
      description: "The leave application has been approved successfully.",
    });
  };

  const handleRejectLeave = (id: number) => {
    setLeaveApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === id ? { ...app, status: "Rejected" } : app
      )
    );
    toast({
      title: "Leave Rejected",
      description: "The leave application has been rejected.",
    });
  };

  const handleCreateLeave = () => {
    toast({
      title: "Leave Application",
      description: "Opening leave application form...",
    });
    // In a real app, this would open a modal or navigate to a form
  };

  const filteredApplications = leaveApplications.filter(app => {
    if (activeTab === "all") return true;
    return app.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Leave Management</h1>
              <p className="text-gray-500">Track and manage employee leave applications</p>
            </div>
            <Button className="flex items-center gap-2" onClick={handleCreateLeave}>
              <Plus className="h-4 w-4" />
              Apply for Leave
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Leave Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Annual Leave</div>
                    <div className="font-medium">15 days</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Sick Leave</div>
                    <div className="font-medium">10 days</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Personal Leave</div>
                    <div className="font-medium">5 days</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Study Leave</div>
                    <div className="font-medium">3 days</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Leave Applications</CardTitle>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="" alt={application.employee.name} />
                                  <AvatarFallback>{application.employee.avatar}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{application.employee.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{application.type}</div>
                              <div className="text-xs text-gray-500">
                                {application.startDate} to {application.endDate}
                              </div>
                            </TableCell>
                            <TableCell>{application.duration}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  application.status === "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : application.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                {application.status === "Pending" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600"
                                      onClick={() => handleApproveLeave(application.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600"
                                      onClick={() => handleRejectLeave(application.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
