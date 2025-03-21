
import React, { useEffect } from 'react';
import SidebarNav from "@/components/SidebarNav";
import Dashboard from '@/components/home/Dashboard';
import { useSubscription } from '@/context/SubscriptionContext';
import EmployeeStats from '@/components/EmployeeStats';
import QuickLinks from "@/components/QuickLinks";
import TodaysAttendance from "@/components/TodaysAttendance";
import TaskReminders from "@/components/TaskReminders";
import ExpenseGraph from "@/components/ExpenseGraph";
import EmployeeLocation from "@/components/EmployeeLocation";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient for React Query
const queryClient = new QueryClient();

const Index = () => {
  const { plan, setShowSubscriptionModal } = useSubscription();
  
  // Show subscription modal for new users
  useEffect(() => {
    if (plan === "None") {
      const timer = setTimeout(() => {
        setShowSubscriptionModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [plan, setShowSubscriptionModal]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-8">
                <Dashboard />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <EmployeeStats />
                    <QuickLinks />
                    <TaskReminders />
                  </div>
                  <div className="space-y-6">
                    <TodaysAttendance />
                    <ExpenseGraph />
                    <EmployeeLocation />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
