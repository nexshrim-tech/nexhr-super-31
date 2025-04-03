
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/lib/protected-route';

// Import pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Index from '@/pages/Index';  // Using Index component for the dashboard
import Expenses from '@/pages/Expenses';
import Salary from '@/pages/Salary';
import Employees from '@/pages/Employees';
import Logout from '@/pages/Logout';
import LeaveManagement from '@/pages/LeaveManagement';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/salary" 
            element={
              <ProtectedRoute>
                <Salary />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute requiredRoles={['admin', 'hr']}>
                <Employees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave" 
            element={
              <ProtectedRoute>
                <LeaveManagement />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
