
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import EmployeeStats from "@/components/EmployeeStats";
import TodaysAttendance from "@/components/TodaysAttendance";
import ExpenseGraph from "@/components/ExpenseGraph";
import EmployeeLocation from "@/components/EmployeeLocation";
import QuickLinks from "@/components/QuickLinks";
import TaskReminders from "@/components/TaskReminders";
import SubscriptionManager from "@/components/SubscriptionManager";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowUp, Sparkles } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";

const Index = () => {
  const { setShowSubscriptionModal } = useSubscription();
  
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader title="Dashboard" />
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4">
              <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent animate-fade-in flex items-center">
                  Welcome to Your Dashboard
                  <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse-slow" />
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-nexhr-primary to-purple-600 mt-1 mb-3 rounded-full"></div>
                <p className="text-gray-600 mt-2">
                  Here's what's happening in your organization today
                </p>
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg rounded-lg">
                <EmployeeStats />
              </div>
            </div>
            
            <Button
              onClick={() => setShowSubscriptionModal(true)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-nexhr-primary to-purple-600 text-white hover:opacity-90 shadow-lg flex items-center gap-2 z-10 rounded-full py-6 hover:shadow-xl transition-all duration-300 group animate-pulse-slow"
            >
              <CreditCard className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
              <span>Manage Subscription</span>
              <ArrowUp className="ml-1 h-4 w-4 animate-bounce" />
            </Button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
              <div className="transform hover:scale-[1.01] transition-all duration-300 dashboard-card rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg">
                <TodaysAttendance />
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300 dashboard-card rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg">
                <ExpenseGraph />
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300 dashboard-card rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg">
                <EmployeeLocation />
              </div>
            </div>
            <div className="space-y-6">
              <div className="transform hover:scale-[1.01] transition-all duration-300 dashboard-card rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg">
                <SubscriptionManager />
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300 dashboard-card glass-effect rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg">
                <QuickLinks />
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300 dashboard-card gradient-border rounded-lg overflow-hidden shadow-md hover:shadow-lg">
                <TaskReminders />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
