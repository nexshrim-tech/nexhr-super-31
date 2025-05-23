
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContextProvider } from "@/hooks/use-toast";
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
import Unauthorized from "@/pages/Unauthorized";
import Posts from "@/pages/Posts";
import ProjectManagement from "@/pages/ProjectManagement";
import Salary from "@/pages/Salary";
import Settings from "@/pages/Settings";
import TasksReminders from "@/pages/TasksReminders";
import Track from "@/pages/Track";
import AllEmployees from "@/pages/AllEmployees";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import SubscriptionModal from "./components/SubscriptionModal";
import { useSubscription } from "./context/SubscriptionContext";
import RequireAuth from "./components/RequireAuth";

// Create a client
const queryClient = new QueryClient();

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
        {/* Public routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Customer & Employee routes */}
        <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/messenger" element={<RequireAuth><Messenger /></RequireAuth>} />
        <Route path="/posts" element={<RequireAuth><Posts /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        
        {/* Customer-only routes */}
        <Route path="/add-employee" element={<RequireAuth allowedRoles={['customer']}><AddEmployee /></RequireAuth>} />
        <Route path="/all-employees" element={<RequireAuth allowedRoles={['customer']}><AllEmployees /></RequireAuth>} />
        <Route path="/department" element={<RequireAuth allowedRoles={['customer']}><Department /></RequireAuth>} />
        
        {/* Customer routes with subscription features */}
        <Route path="/document-generator" element={<RequireAuth allowedRoles={['customer']}><DocumentGenerator /></RequireAuth>} />
        <Route path="/expenses" element={<RequireAuth allowedRoles={['customer']}><Expenses /></RequireAuth>} />
        <Route path="/help-desk" element={<RequireAuth allowedRoles={['customer']}><HelpDesk /></RequireAuth>} />
        <Route path="/project-management" element={<RequireAuth allowedRoles={['customer']}><ProjectManagement /></RequireAuth>} />
        
        {/* Shared routes (with different permissions) */}
        <Route path="/employee/:id" element={<RequireAuth><EmployeeDetails /></RequireAuth>} />
        <Route path="/assets" element={<RequireAuth><Assets /></RequireAuth>} />
        <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
        <Route path="/leave-management" element={<RequireAuth><LeaveManagement /></RequireAuth>} />
        <Route path="/meetings" element={<RequireAuth><Meetings /></RequireAuth>} />
        <Route path="/salary" element={<RequireAuth><Salary /></RequireAuth>} />
        <Route path="/tasks-reminders" element={<RequireAuth><TasksReminders /></RequireAuth>} />
        <Route path="/track" element={<RequireAuth><Track /></RequireAuth>} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <AppRoutes />
            <Toaster />
          </SubscriptionProvider>
        </AuthProvider>
      </ToastContextProvider>
    </QueryClientProvider>
  );
}

export default App;
