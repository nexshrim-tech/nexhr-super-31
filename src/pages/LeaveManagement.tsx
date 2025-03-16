
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveOverview from "@/components/leave-management/LeaveOverview";
import LeaveTable from "@/components/leave-management/LeaveTable";
import LeaveCalendar from "@/components/leave-management/LeaveCalendar";
import LeaveApplicationForm from "@/components/leave-management/LeaveApplicationForm";
import LeaveHistoryTable from "@/components/leave-management/LeaveHistoryTable";
import LeaveBalanceTable from "@/components/leave-management/LeaveBalanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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

          <Card className="mb-6 transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg border-t-4 border-t-nexhr-primary rounded-lg overflow-hidden animate-scale-in">
            <CardContent className="p-6">
              <LeaveOverview />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden glass-effect border border-gray-200 animate-scale-in">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                  Apply for Leave
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LeaveApplicationForm />
              </CardContent>
            </Card>

            <Card className="md:col-span-2 transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden border border-gray-200 animate-scale-in">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                  Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 overflow-x-auto">
                <LeaveBalanceTable />
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
                    onApprove={(id) => {
                      toast({
                        title: "Leave Approved",
                        description: `Leave request #${id} has been approved.`,
                      });
                    }}
                    onReject={(id) => {
                      toast({
                        title: "Leave Rejected",
                        description: `Leave request #${id} has been rejected.`,
                      });
                    }}
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
                  <LeaveCalendar />
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
                  <LeaveHistoryTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
