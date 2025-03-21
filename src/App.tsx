
import { Route, Routes, BrowserRouter } from "react-router-dom";
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
import PrivateRoute from "./components/PrivateRoute";

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
        {/* Public Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - accessible to all authenticated users */}
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/employee/:id" element={<PrivateRoute><EmployeeDetails /></PrivateRoute>} />
        <Route path="/assets" element={<PrivateRoute><Assets /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
        <Route path="/document-generator" element={<PrivateRoute><DocumentGenerator /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
        <Route path="/help-desk" element={<PrivateRoute><HelpDesk /></PrivateRoute>} />
        <Route path="/leave-management" element={<PrivateRoute><LeaveManagement /></PrivateRoute>} />
        <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
        <Route path="/meetings" element={<PrivateRoute><Meetings /></PrivateRoute>} />
        <Route path="/messenger" element={<PrivateRoute><Messenger /></PrivateRoute>} />
        <Route path="/project-management" element={<PrivateRoute><ProjectManagement /></PrivateRoute>} />
        <Route path="/salary" element={<PrivateRoute><Salary /></PrivateRoute>} />
        <Route path="/tasks-reminders" element={<PrivateRoute><TasksReminders /></PrivateRoute>} />
        <Route path="/track" element={<PrivateRoute><Track /></PrivateRoute>} />

        {/* Admin-only Routes */}
        <Route path="/add-employee" element={<PrivateRoute requireAdmin={true}><AddEmployee /></PrivateRoute>} />
        <Route path="/all-employees" element={<PrivateRoute requireAdmin={true}><AllEmployees /></PrivateRoute>} />
        <Route path="/department" element={<PrivateRoute requireAdmin={true}><Department /></PrivateRoute>} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SubscriptionProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </SubscriptionProvider>
    </BrowserRouter>
  );
}

export default App;
