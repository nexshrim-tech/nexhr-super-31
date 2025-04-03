
import React, { useEffect, useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import EmployeeList from "@/components/EmployeeList";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCurrentCustomer } from "@/services/customerService";
import { getEmployees } from "@/services/employeeService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        if (user) {
          // Get customer ID from the authenticated user
          const customer = await getCurrentCustomer(user);
          if (customer) {
            setCustomerId(customer.customerid);
            
            // Fetch employees for this customer
            const employeeData = await getEmployees(customer.customerid);
            setEmployees(employeeData);
          }
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "Error loading employees",
          description: "Could not load employee data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user, toast]);

  const handleAddEmployee = () => {
    navigate("/employees/add");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <UserHeader title="Employee Directory" />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent flex items-center">
              Employee Directory
              <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse-slow" />
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-nexhr-primary to-purple-600 mt-1 mb-3 rounded-full"></div>
            <p className="text-gray-600">Manage your organization's employee records</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                {isLoading ? "Loading..." : `${employees.length} employees`}
              </p>
            </div>
            <Button onClick={handleAddEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>

          <EmployeeList 
            employees={employees} 
            isLoading={isLoading}
            customerId={customerId}
          />
        </div>
      </div>
    </div>
  );
};

export default Employees;
