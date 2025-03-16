
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveTable from "@/components/leave-management/LeaveTable";
import LeaveCalendar from "@/components/leave-management/LeaveCalendar";
import LeaveApplicationForm from "@/components/leave-management/LeaveApplicationForm";
import LeaveHistoryTable from "@/components/leave-management/LeaveHistoryTable";
import LeaveBalanceTable from "@/components/leave-management/LeaveBalanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const MOCK_LEAVE_BALANCE = [
  {
    id: 1,
    type: "Annual Leave",
    total: 20,
    used: 5,
    balance: 15
  },
  {
    id: 2,
    type: "Sick Leave",
    total: 10,
    used: 2,
    balance: 8
  },
  {
    id: 3,
    type: "Personal Leave",
    total: 5,
    used: 1,
    balance: 4
  },
  {
    id: 4,
    type: "Study Leave",
    total: 3,
    used: 0,
    balance: 3
  }
];

const MOCK_LEAVE_HISTORY = [
  {
    id: 1,
    type: "Annual Leave",
    startDate: "2023-07-10",
    endDate: "2023-07-17",
    duration: "5 days",
    status: "Completed"
  },
  {
    id: 2,
    type: "Sick Leave",
    startDate: "2023-05-22",
    endDate: "2023-05-23",
    duration: "2 days",
    status: "Completed"
  },
  {
    id: 3,
    type: "Personal Leave",
    startDate: "2023-03-15",
    endDate: "2023-03-15",
    duration: "1 day",
    status: "Completed"
  }
];

const MOCK_LEAVE_APPLICATIONS = [
  {
    id: 1,
    employee: {
      name: "John Doe",
      avatar: "JD"
    },
    type: "Annual Leave",
    startDate: "2023-08-15",
    endDate: "2023-08-22",
    duration: "5 days",
    status: "Pending"
  },
  {
    id: 2,
    employee: {
      name: "Jane Smith",
      avatar: "JS"
    },
    type: "Sick Leave",
    startDate: "2023-08-18",
    endDate: "2023-08-19",
    duration: "2 days",
    status: "Pending"
  },
  {
    id: 3,
    employee: {
      name: "Mike Johnson",
      avatar: "MJ"
    },
    type: "Personal Leave",
    startDate: "2023-08-25",
    endDate: "2023-08-25",
    duration: "1 day",
    status: "Pending"
  }
];

const MOCK_LEAVE_BALANCE_TABLE = [
  {
    id: 1,
    employeeId: "EMP001",
    employee: "John Doe",
    type: "Annual Leave",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    duration: "N/A",
    status: "Active",
    balance: 15
  },
  {
    id: 2,
    employeeId: "EMP001",
    employee: "John Doe",
    type: "Sick Leave",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    duration: "N/A",
    status: "Active",
    balance: 8
  },
  {
    id: 3,
    employeeId: "EMP002",
    employee: "Jane Smith",
    type: "Annual Leave",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    duration: "N/A",
    status: "Active",
    balance: 12
  },
  {
    id: 4,
    employeeId: "EMP002",
    employee: "Jane Smith",
    type: "Sick Leave",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    duration: "N/A",
    status: "Active",
    balance: 10
  }
];

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [leaveBalances, setLeaveBalances] = useState(MOCK_LEAVE_BALANCE_TABLE);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmitApplication = (formData: FormData) => {
    // Process form data
    toast({
      title: "Leave Application Submitted",
      description: "Your leave application has been submitted successfully.",
    });
    
    setShowApplicationForm(false);
  };

  const handleViewLeave = (application: any) => {
    setSelectedApplication(application);
  };

  const handleApproveLeave = (id: number) => {
    toast({
      title: "Leave Approved",
      description: `Leave request #${id} has been approved.`,
    });
  };

  const handleRejectLeave = (id: number) => {
    toast({
      title: "Leave Rejected",
      description: `Leave request #${id} has been rejected.`,
    });
  };

  const handleUpdateLeaveBalance = (id: number, type: string, newBalance: number) => {
    setLeaveBalances(prevBalances => 
      prevBalances.map(balance => 
        balance.id === id ? { ...balance, balance: newBalance } : balance
      )
    );
    
    toast({
      title: "Leave Balance Updated",
      description: `${type} balance has been updated to ${newBalance} days.`,
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader title="Leave Management" />
        <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in flex items-center">
              Leave Management
              <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse-slow" />
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-nexhr-primary to-purple-600 mt-1 mb-3 rounded-full"></div>
            <p className="text-gray-600">
              Manage employee leave requests, view leave balances, and track leave history
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden glass-effect border border-gray-200 animate-scale-in">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                  Apply for Leave
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LeaveApplicationForm 
                  onSubmit={handleSubmitApplication}
                  onCancel={() => setShowApplicationForm(false)}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2 transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200 animate-scale-in">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                  Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 overflow-x-auto">
                <LeaveBalanceTable 
                  balanceData={leaveBalances}
                />
              </CardContent>
            </Card>
          </div>

          <Tabs 
            defaultValue={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-2 px-1 rounded-lg shadow-sm mb-4">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="overview" className="text-sm md:text-base">Pending Requests</TabsTrigger>
                <TabsTrigger value="calendar" className="text-sm md:text-base">Calendar View</TabsTrigger>
                <TabsTrigger value="history" className="text-sm md:text-base">Leave History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-2 animate-fade-in">
              <Card className="transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                    Pending Leave Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className={`${isMobile ? 'p-2' : 'p-6'} overflow-x-auto`}>
                  <LeaveTable 
                    applications={MOCK_LEAVE_APPLICATIONS}
                    onViewLeave={handleViewLeave}
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="mt-2 animate-fade-in">
              <Card className="transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                    Leave Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <LeaveCalendar 
                    date={selectedDate}
                    setDate={setSelectedDate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-2 animate-fade-in">
              <Card className="transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                    Leave History
                  </CardTitle>
                </CardHeader>
                <CardContent className={`${isMobile ? 'p-2' : 'p-6'} overflow-x-auto`}>
                  <LeaveHistoryTable 
                    historyData={MOCK_LEAVE_HISTORY}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent>
            <DialogTitle>Leave Application Details</DialogTitle>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Employee:</span>
                <span>{selectedApplication.employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Leave Type:</span>
                <span>{selectedApplication.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{selectedApplication.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Period:</span>
                <span>{selectedApplication.startDate} to {selectedApplication.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`${
                  selectedApplication.status === "Approved"
                    ? "text-green-600"
                    : selectedApplication.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {selectedApplication.status}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LeaveManagement;
