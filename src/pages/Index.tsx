
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
import { CreditCard, ArrowUp, Home } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { setShowSubscriptionModal } = useSubscription();
  
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader title="Dashboard" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4">
              <EmployeeStats />
            </div>
            
            <Button
              onClick={() => setShowSubscriptionModal(true)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-nexhr-primary to-purple-600 text-white hover:opacity-90 shadow-lg flex items-center gap-2 z-10 rounded-full py-6"
            >
              <CreditCard className="h-5 w-5 mr-1" />
              <span>Manage Subscription</span>
              <ArrowUp className="ml-1 h-4 w-4 animate-bounce" />
            </Button>

            {/* Fixed Back to Landing Page Button */}
            <div className="fixed bottom-6 left-6 z-50">
              <Link to="/landing">
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-5 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Back to Landing Page
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
              <TodaysAttendance />
              <ExpenseGraph />
              <EmployeeLocation />
            </div>
            <div className="space-y-6">
              <SubscriptionManager />
              <QuickLinks />
              <TaskReminders />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
