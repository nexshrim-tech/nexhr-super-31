import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import Dashboard from "./pages/Dashboard";
import AllEmployees from "./pages/AllEmployees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import Categories from "./pages/Categories";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";
import Salary from "./pages/Salary";
import AddSalary from "./pages/AddSalary";
import EditSalary from "./pages/EditSalary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/all-employees" element={<ProtectedRoute><AllEmployees /></ProtectedRoute>} />
                <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
                <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/add-category" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
                <Route path="/edit-category/:id" element={<ProtectedRoute><EditCategory /></ProtectedRoute>} />
                <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
                <Route path="/add-salary" element={<ProtectedRoute><AddSalary /></ProtectedRoute>} />
                <Route path="/edit-salary/:id" element={<ProtectedRoute><EditSalary /></ProtectedRoute>} />
              </Routes>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
