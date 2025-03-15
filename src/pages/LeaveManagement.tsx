
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Check, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import LeaveCalendar from "@/components/leave-management/LeaveCalendar";
import LeaveApplicationForm from "@/components/leave-management/LeaveApplicationForm";
import LeaveTable from "@/components/leave-management/LeaveTable";
import LeaveHistoryTable from "@/components/leave-management/LeaveHistoryTable";

const initialLeaveApplications = [
  {
    id: 1,
    employeeId: "EMP001",
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
    employeeId: "EMP002",
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
    employeeId: "EMP003",
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
    employeeId: "EMP004",
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
    employeeId: "EMP005",
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
    employeeId: "EMP001",
    employee: "Olivia Rhye",
    type: "Annual Leave",
    startDate: "2023-01-10",
    endDate: "2023-01-15",
    duration: "5 days",
    status: "Completed",
  },
  {
    id: 2,
    employeeId: "EMP001",
    employee: "Olivia Rhye",
    type: "Sick Leave",
    startDate: "2023-03-22",
    endDate: "2023-03-23",
    duration: "2 days",
    status: "Completed",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employee: "Lana Steiner",
    type: "Personal Leave",
    startDate: "2023-05-15",
    endDate: "2023-05-16",
    duration: "2 days",
    status: "Completed",
  },
  {
    id: 4,
    employeeId: "EMP002",
    employee: "Phoenix Baker",
    type: "Annual Leave",
    startDate: "2023-07-05",
    endDate: "2023-07-10",
    duration: "5 days",
    status: "Completed",
  },
  {
    id: 5,
    employeeId: "EMP005",
    employee: "Candice Wu",
    type: "Sick Leave",
    startDate: "2023-06-12",
    endDate: "2023-06-13",
    duration: "2 days",
    status: "Completed",
  },
  {
    id: 6,
    employeeId: "EMP004",
    employee: "Demi Wilkinson",
    type: "Personal Leave",
    startDate: "2023-04-20",
    endDate: "2023-04-21",
    duration: "2 days",
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
  const [historyTab, setHistoryTab] = useState("all");
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

  const handleCreateLeave = (formData: FormData) => {
    const newLeave = {
      id: leaveApplications.length + 1,
      employeeId: "EMP010",
      employee: { name: "Current User", avatar: "CU" },
      type: formData.get('leaveType') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      duration: calculateDuration(
        formData.get('startDate') as string,
        formData.get('endDate') as string
      ),
      status: "Pending",
      reason: formData.get('reason') as string,
    };
    
    setLeaveApplications([...leaveApplications, newLeave]);
    setShowApplyLeaveDialog(false);
    toast({
      title: "Leave Application Submitted",
      description: "Your leave application has been submitted for approval.",
    });
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

  const filteredHistoryData = leaveHistoryData.filter(item => {
    if (historyTab === "all") return true;
    return item.type.toLowerCase().includes(historyTab.toLowerCase());
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

          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Leave Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaveCalendar date={date} setDate={setDate} />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-8">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="text-base">Leave Applications</CardTitle>
                    <Tabs 
                      defaultValue="all" 
                      onValueChange={setActiveTab}
                      className="w-full max-w-[400px]"
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <LeaveTable 
                    applications={filteredApplications}
                    onViewLeave={(app) => {
                      setViewLeaveDetails(app);
                      setShowViewDialog(true);
                    }}
                    onApproveLeave={handleApproveLeave}
                    onRejectLeave={handleRejectLeave}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="text-base">Leave History</CardTitle>
                  <Tabs 
                    defaultValue="all" 
                    onValueChange={setHistoryTab}
                    className="w-full max-w-[400px]"
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="annual">Annual</TabsTrigger>
                      <TabsTrigger value="sick">Sick</TabsTrigger>
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <LeaveHistoryTable historyData={filteredHistoryData} showEmployee={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={showApplyLeaveDialog} onOpenChange={setShowApplyLeaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Fill in the details to submit your leave application.
            </DialogDescription>
          </DialogHeader>
          <LeaveApplicationForm
            onSubmit={handleCreateLeave}
            onCancel={() => setShowApplyLeaveDialog(false)}
          />
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
                  <p className="text-sm font-medium text-gray-500">Employee ID</p>
                  <p className="mt-1">{viewLeaveDetails.employeeId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                    className={`${
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
