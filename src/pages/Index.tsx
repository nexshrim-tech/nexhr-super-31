
import { useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import QuickLinks from "@/components/QuickLinks";
import TaskReminders from "@/components/TaskReminders";
import EmployeeStats from "@/components/EmployeeStats";
import ExpenseGraph from "@/components/ExpenseGraph";
import EmployeeLocation from "@/components/EmployeeLocation";
import EmployeeList from "@/components/EmployeeList";
import TodaysAttendance from "@/components/TodaysAttendance";
import SubscriptionModal from "@/components/SubscriptionModal";
import FeatureLock from "@/components/FeatureLock";
import { useSubscription } from "@/context/SubscriptionContext";

const Dashboard = () => {
  const { 
    showSubscriptionModal, 
    setShowSubscriptionModal, 
    setPlan, 
    features 
  } = useSubscription();

  // Check if user is newly registered and show subscription modal
  useEffect(() => {
    const isNewUser = localStorage.getItem("new-user") === "true";
    if (isNewUser) {
      setTimeout(() => {
        setShowSubscriptionModal(true);
        localStorage.removeItem("new-user");
      }, 1500);
    }
  }, [setShowSubscriptionModal]);

  const handleSubscribe = (plan: string) => {
    setPlan(plan as any);
    setShowSubscriptionModal(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <UserHeader />
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <QuickLinks />
              {features.employeeManagement ? (
                <EmployeeStats />
              ) : (
                <FeatureLock 
                  title="Employee Stats Locked" 
                  description="Upgrade your plan to access employee statistics and analytics."
                />
              )}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-6">
                {features.employeeManagement ? (
                  <TaskReminders />
                ) : (
                  <FeatureLock 
                    title="Task Management Locked" 
                    description="Upgrade your plan to manage tasks and reminders."
                  />
                )}
                {features.attendanceTracking ? (
                  <TodaysAttendance />
                ) : (
                  <FeatureLock 
                    title="Attendance Tracking Locked" 
                    description="Upgrade your plan to track employee attendance."
                  />
                )}
              </div>
              <div className="grid gap-6">
                {features.expenseManagement ? (
                  <ExpenseGraph />
                ) : (
                  <FeatureLock 
                    title="Expense Management Locked" 
                    description="Upgrade your plan to access expense tracking and analytics."
                  />
                )}
                {features.employeeManagement ? (
                  <EmployeeLocation />
                ) : (
                  <FeatureLock 
                    title="Employee Location Locked" 
                    description="Upgrade your plan to track employee locations."
                  />
                )}
              </div>
            </div>
            {features.employeeManagement ? (
              <EmployeeList />
            ) : (
              <FeatureLock 
                title="Employee Management Locked" 
                description="Upgrade your plan to access the full employee management system."
              />
            )}
          </div>
        </div>
      </div>

      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default Dashboard;
