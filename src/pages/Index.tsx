
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

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <UserHeader title="Dashboard" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EmployeeStats />
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
