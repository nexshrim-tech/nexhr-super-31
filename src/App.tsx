
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
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
        <Route path="/all-employees" element={<ProtectedRoute><AllEmployees /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/department" element={<ProtectedRoute><Department /></ProtectedRoute>} />
        <Route path="/document-generator" element={<ProtectedRoute><DocumentGenerator /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/help-desk" element={<ProtectedRoute><HelpDesk /></ProtectedRoute>} />
        <Route path="/leave-management" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
        <Route path="/messenger" element={<ProtectedRoute><Messenger /></ProtectedRoute>} />
        <Route path="/project-management" element={<ProtectedRoute><ProjectManagement /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
        <Route path="/tasks-reminders" element={<ProtectedRoute><TasksReminders /></ProtectedRoute>} />
        <Route path="/track" element={<ProtectedRoute><Track /></ProtectedRoute>} />
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
