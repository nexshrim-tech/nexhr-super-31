
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import AllEmployees from "./pages/AllEmployees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import LeaveManagement from "./pages/LeaveManagement";
import DocumentGenerator from "./pages/DocumentGenerator";
import Assets from "./pages/Assets";
import TasksReminders from "./pages/TasksReminders";
import Expenses from "./pages/Expenses";
import Track from "./pages/Track";
import HelpDesk from "./pages/HelpDesk";
import Meetings from "./pages/Meetings";
import Messenger from "./pages/Messenger";
import Department from "./pages/Department";
import ProjectManagement from "./pages/ProjectManagement";
import Logout from "./pages/Logout";
import { SubscriptionProvider } from "./context/SubscriptionContext";

function App() {
  return (
    <SubscriptionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/employees" element={<AllEmployees />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
          <Route path="/document-generator" element={<DocumentGenerator />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/tasks" element={<TasksReminders />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/track" element={<Track />} />
          <Route path="/help-desk" element={<HelpDesk />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/department" element={<Department />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SubscriptionProvider>
  );
}

export default App;
