
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Track from "./pages/Track";
import NotFound from "./pages/NotFound";
import AddEmployee from "./pages/AddEmployee";
import AllEmployees from "./pages/AllEmployees";
import Attendance from "./pages/Attendance";
import TasksReminders from "./pages/TasksReminders";
import Expenses from "./pages/Expenses";
import LeaveManagement from "./pages/LeaveManagement";
import Salary from "./pages/Salary";
import Assets from "./pages/Assets";
import Department from "./pages/Department";
import HelpDesk from "./pages/HelpDesk";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import DocumentGenerator from "./pages/DocumentGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Index />} />
          <Route path="/track" element={<Track />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/all-employees" element={<AllEmployees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/tasks" element={<TasksReminders />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/department" element={<Department />} />
          <Route path="/help-desk" element={<HelpDesk />} />
          <Route path="/documents" element={<DocumentGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
