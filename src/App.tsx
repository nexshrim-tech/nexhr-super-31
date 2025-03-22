import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Assets from "@/pages/Assets";
import Attendance from "@/pages/Attendance";
import Department from "@/pages/Department";
import DocumentGenerator from "@/pages/DocumentGenerator";
import AddEmployee from "@/pages/AddEmployee";
import EmployeeDetails from "@/pages/EmployeeDetails";
import Expenses from "@/pages/Expenses";
import HelpDesk from "@/pages/HelpDesk";
import Landing from "@/pages/Landing";
import LeaveManagement from "@/pages/LeaveManagement";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import Meetings from "@/pages/Meetings";
import Messenger from "@/pages/Messenger";
import NotFound from "@/pages/NotFound";
import ProjectManagement from "@/pages/ProjectManagement";
import Salary from "@/pages/Salary";
import TasksReminders from "@/pages/TasksReminders";
import Track from "@/pages/Track";
import AllEmployees from "@/pages/AllEmployees";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import SubscriptionModal from "./components/SubscriptionModal";
import { useSubscription } from "./context/SubscriptionContext";

function SubscriptionModalWrapper() {
  const { showSubscriptionModal, setShowSubscriptionModal, setPlan, plan } = useSubscription();
  
  const handleSubscribe = (selectedPlan: string) => {
    setPlan(selectedPlan as any);
  };
  
  return (
    <SubscriptionModal 
      isOpen={showSubscriptionModal} 
      onClose={() => setShowSubscriptionModal(false)}
      onSubscribe={handleSubscribe}
      forceOpen={plan === "None"}
    />
  );
}

function AppRoutes() {
  return (
    <>
      <SubscriptionModalWrapper />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
        <Route path="/all-employees" element={<AllEmployees />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/department" element={<Department />} />
        <Route path="/document-generator" element={<DocumentGenerator />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/help-desk" element={<HelpDesk />} />
        <Route path="/leave-management" element={<LeaveManagement />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/messenger" element={<Messenger />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/tasks-reminders" element={<TasksReminders />} />
        <Route path="/track" element={<Track />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <SubscriptionProvider>
      <AppRoutes />
      <Toaster />
    </SubscriptionProvider>
  );
}

export default App;
