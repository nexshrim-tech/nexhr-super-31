import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import EmployeeLocation from '@/components/EmployeeLocation';
import LocationMap from '@/components/LocationMap';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: number;
  name: string;
  role: string;
  location: { lat: number; lng: number } | null;
  lastActive: string;
}

const Track = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const mockEmployees: Employee[] = [
          {
            id: 1,
            name: "John Doe",
            role: "Developer",
            location: { lat: 37.7749, lng: -122.4194 },
            lastActive: "2 minutes ago"
          },
          {
            id: 2,
            name: "Jane Smith",
            role: "Designer",
            location: { lat: 37.7833, lng: -122.4167 },
            lastActive: "5 minutes ago"
          },
          {
            id: 3,
            name: "Bob Johnson",
            role: "Manager",
            location: { lat: 37.7694, lng: -122.4862 },
            lastActive: "15 minutes ago"
          }
        ];

        setEmployees(mockEmployees);
        if (mockEmployees.length > 0) {
          setSelectedEmployee(mockEmployees[0]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employee data");
        toast({
          title: "Error",
          description: "Failed to load employee location data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading employee locations...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Go back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Tracking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Employees</h2>
          <div className="space-y-4">
            {employees.map(employee => (
              <EmployeeLocation
                key={employee.id}
                employee={employee}
                selected={selectedEmployee?.id === employee.id}
                onClick={() => handleEmployeeClick(employee)}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedEmployee && selectedEmployee.location ? (
            <LocationMap employee={selectedEmployee} />
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <p className="text-gray-500">No location data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
