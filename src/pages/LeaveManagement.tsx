
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Download, FileText, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialLeaveApplications = [
  {
    id: 1,
    employee: { name: "Olivia Rhye", avatar: "OR" },
    type: "Annual Leave",
    startDate: "2023-08-15",
    endDate: "2023-08-20",
    duration: "5 days",
    status: "Approved",
    reason: "Family vacation in Hawaii",
  },
  {
    id: 2,
    employee: { name: "Phoenix Baker", avatar: "PB" },
    type: "Sick Leave",
    startDate: "2023-08-10",
    endDate: "2023-08-11",
    duration: "2 days",
    status: "Pending",
    reason: "Recovering from flu",
  },
  {
    id: 3,
    employee: { name: "Lana Steiner", avatar: "LS" },
    type: "Personal Leave",
    startDate: "2023-08-25",
    endDate: "2023-08-26",
    duration: "2 days",
    status: "Pending",
    reason: "Family emergency",
  },
  {
    id: 4,
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    type: "Maternity Leave",
    startDate: "2023-09-01",
    endDate: "2023-12-01",
    duration: "3 months",
    status: "Approved",
    reason: "Maternity leave for first child",
  },
  {
    id: 5,
    employee: { name: "Candice Wu", avatar: "CW" },
    type: "Annual Leave",
    startDate: "2023-08-05",
    endDate: "2023-08-07",
    duration: "3 days",
    status: "Rejected",
    reason: "Planned international trip",
  },
];

const leaveHistoryData = [
  {
    id: 1,
    type: "Annual Leave",
    startDate: "2023-01-10",
    endDate: "2023-01-15",
    duration: "5 days",
    status: "Completed",
  },
  {
    id: 2,
    type: "Sick Leave",
    startDate: "2023-03-22",
    endDate: "2023-03-23",
    duration: "2 days",
    status: "Completed",
  },
  {
    id: 3,
    type: "Personal Leave",
    startDate: "2023-05-15",
    endDate: "2023-05-16",
    duration: "2 days",
    status: "Completed",
  },
  {
    id: 4,
    type: "Annual Leave",
    startDate: "2023-07-05",
    endDate: "2023-07-10",
    duration: "5 days",
    status: "Completed",
  },
];

const leaveBalanceData = [
  { type: "Annual Leave", total: 20, used: 5, balance: 15 },
  { type: "Sick Leave", total: 12, used: 2, balance: 10 },
  { type: "Personal Leave", total: 7, used: 2, balance: 5 },
  { type: "Study Leave", total: 5, used: 2, balance: 3 },
];

const LeaveManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [leaveApplications, setLeaveApplications] = useState(initialLeaveApplications);
  const [showApplyLeaveDialog, setShowApplyLeaveDialog] = useState(false);
  const [viewLeaveDetails, setViewLeaveDetails] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
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

  const handleCreateLeave = (formData: any) => {
    const newLeave = {
      id: leaveApplications.length + 1,
      employee: { name: "Current User", avatar: "CU" },
      type: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: calculateDuration(formData.startDate, formData.endDate),
      status: "Pending",
      reason: formData.reason,
    };
    
    setLeaveApplications([...leaveApplications, newLeave]);
    setShowApplyLeaveDialog(false);
    toast({
      title: "Leave Application Submitted",
      description: "Your leave application has been submitted for approval.",
    });
  };

  const handleViewLeave = (application: any) => {
    setViewLeaveDetails(application);
    setShowViewDialog(true);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  };

  const filteredApplications = leaveApplications.filter(app => {
    if (activeTab === "all") return true;
    return app.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Leave Management</h1>
              <p className="text-gray-500">Track and manage employee leave applications</p>
            </div>
            <Button 
              className="flex items-center gap-2" 
              onClick={() => setShowApplyLeaveDialog(true)}
            >
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Leave Overview</CardTitle>
                  <Tabs defaultValue="balance" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="balance">Balance</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <TabsContent value="balance" className="space-y-4 mt-0">
                    {leaveBalanceData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">{item.type}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500">
                            {item.used}/{item.total}
                          </div>
                          <div className="font-medium">{item.balance} days</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="history" className="mt-0">
                    <div className="space-y-4">
                      {leaveHistoryData.map((leave) => (
                        <div key={leave.id} className="border-b pb-2">
                          <div className="flex justify-between">
                            <div className="font-medium">{leave.type}</div>
                            <div className="text-sm">{leave.duration}</div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <div>{leave.startDate} to {leave.endDate}</div>
                            <Badge className="bg-gray-100 text-gray-800">
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
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
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewLeave(application)}
                                >
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
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600"
                                      onClick={() => handleRejectLeave(application.id)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
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

      {/* Apply for Leave Dialog */}
      <Dialog open={showApplyLeaveDialog} onOpenChange={setShowApplyLeaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Fill in the details to submit your leave application.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              leaveType: formData.get('leaveType') as string,
              startDate: formData.get('startDate') as string,
              endDate: formData.get('endDate') as string,
              reason: formData.get('reason') as string,
            };
            handleCreateLeave(data);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leaveType" className="text-right">
                  Leave Type
                </Label>
                <select
                  id="leaveType"
                  name="leaveType"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Study Leave">Study Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attachment" className="text-right">
                  Attachment
                </Label>
                <Input
                  id="attachment"
                  name="attachment"
                  type="file"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowApplyLeaveDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Leave Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Details</DialogTitle>
          </DialogHeader>
          {viewLeaveDetails && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employee</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{viewLeaveDetails.employee.avatar}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{viewLeaveDetails.employee.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                    className={`mt-1 ${
                      viewLeaveDetails.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : viewLeaveDetails.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewLeaveDetails.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Leave Type</p>
                  <p className="mt-1">{viewLeaveDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="mt-1">{viewLeaveDetails.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="mt-1">{viewLeaveDetails.startDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="mt-1">{viewLeaveDetails.endDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p className="mt-1 text-sm">
                    {viewLeaveDetails.reason || "No reason provided."}
                  </p>
                </div>
              </div>
              {viewLeaveDetails.status === "Pending" && (
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => {
                      handleRejectLeave(viewLeaveDetails.id);
                      setShowViewDialog(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveLeave(viewLeaveDetails.id);
                      setShowViewDialog(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
