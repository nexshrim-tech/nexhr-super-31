
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import QuickLinks from "@/components/QuickLinks";
import TaskReminders from "@/components/TaskReminders";
import EmployeeStats from "@/components/EmployeeStats";
import ExpenseGraph from "@/components/ExpenseGraph";
import EmployeeLocation from "@/components/EmployeeLocation";
import EmployeeList from "@/components/EmployeeList";
import TodaysAttendance from "@/components/TodaysAttendance";

const Dashboard = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <UserHeader />
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <QuickLinks />
              <EmployeeStats />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-6">
                <TaskReminders />
                <TodaysAttendance />
              </div>
              <div className="grid gap-6">
                <ExpenseGraph />
                <EmployeeLocation />
              </div>
            </div>
            <EmployeeList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
