
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
import { AuthProvider } from "./context/AuthContext";
import SubscriptionModal from "./components/SubscriptionModal";
import { useSubscription } from "./context/SubscriptionContext";
import RequireAuth from "./components/RequireAuth";

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
        <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-employee" element={<RequireAuth><AddEmployee /></RequireAuth>} />
        <Route path="/employee/:id" element={<RequireAuth><EmployeeDetails /></RequireAuth>} />
        <Route path="/all-employees" element={<RequireAuth><AllEmployees /></RequireAuth>} />
        <Route path="/assets" element={<RequireAuth><Assets /></RequireAuth>} />
        <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
        <Route path="/department" element={<RequireAuth><Department /></RequireAuth>} />
        <Route path="/document-generator" element={<RequireAuth><DocumentGenerator /></RequireAuth>} />
        <Route path="/expenses" element={<RequireAuth><Expenses /></RequireAuth>} />
        <Route path="/help-desk" element={<RequireAuth><HelpDesk /></RequireAuth>} />
        <Route path="/leave-management" element={<RequireAuth><LeaveManagement /></RequireAuth>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/meetings" element={<RequireAuth><Meetings /></RequireAuth>} />
        <Route path="/messenger" element={<RequireAuth><Messenger /></RequireAuth>} />
        <Route path="/project-management" element={<RequireAuth><ProjectManagement /></RequireAuth>} />
        <Route path="/salary" element={<RequireAuth><Salary /></RequireAuth>} />
        <Route path="/tasks-reminders" element={<RequireAuth><TasksReminders /></RequireAuth>} />
        <Route path="/track" element={<RequireAuth><Track /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppRoutes />
        <Toaster />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
