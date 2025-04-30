
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserMinus, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { toast } from "sonner";

const EmployeeStats = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newHires: 0,
    departures: 0,
    layoffs: 0
  });

  const { data: employees = [], isLoading, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
  });

  // Function to calculate stats based on the current employee data and time range
  const calculateStats = (employeeData: Employee[]) => {
    // Calculate time range cutoffs
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Filter employees based on selected time range
    const filteredEmployees = employeeData.filter((employee) => {
      if (selectedTimeRange === "all") return true;
      
      const joiningDate = employee.joiningdate ? new Date(employee.joiningdate) : null;
      if (!joiningDate) return false;
      
      return selectedTimeRange === "7d" 
        ? joiningDate >= sevenDaysAgo 
        : joiningDate >= thirtyDaysAgo;
    });

    // Calculate statistics
    const totalEmployees = filteredEmployees.filter(e => e.employmentstatus === "Active").length;
    const newHires = filteredEmployees.filter(e => {
      const joiningDate = e.joiningdate ? new Date(e.joiningdate) : null;
      if (!joiningDate) return false;
      
      return selectedTimeRange === "7d"
        ? joiningDate >= sevenDaysAgo
        : selectedTimeRange === "30d"
          ? joiningDate >= thirtyDaysAgo
          : true;
    }).length;

    const departures = filteredEmployees.filter(e => e.employmentstatus === "Inactive").length;
    const layoffs = filteredEmployees.filter(e => e.employmentstatus === "Terminated").length;

    return {
      totalEmployees,
      newHires,
      departures,
      layoffs
    };
  };

  useEffect(() => {
    if (!employees.length) return;

    const newStats = calculateStats(employees);
    setStats(newStats);

    // Set up real-time subscription to track all employee changes including deletions
    const channel = supabase
      .channel('employee-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'employee'
        },
        (payload) => {
          console.log('Employee data changed:', payload);
          
          // Refetch data when changes occur to update stats
          refetch().then(() => {
            if (payload.eventType === 'DELETE') {
              toast("Employee has been deleted");
            } else {
              toast("Employee data updated");
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [employees, selectedTimeRange, refetch]);

  if (isLoading) {
    return (
      <Card className="shadow-md border-t-2 border-t-nexhr-primary animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Loading employee statistics...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-t-2 border-t-nexhr-primary animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">Employee Statistics</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time data</p>
          </div>
          <Tabs defaultValue={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <TabsList className="bg-muted">
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-blue-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">{stats.totalEmployees}</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-green text-white">
              Live
            </Badge>
          </div>
        </div>
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-green-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">New Hires</div>
            <div className="bg-green-100 p-2 rounded-full">
              <UserPlus className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">{stats.newHires}</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-green text-white">
              Live
            </Badge>
          </div>
        </div>
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-red-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">Departures</div>
            <div className="bg-red-100 p-2 rounded-full">
              <UserMinus className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">{stats.departures}</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-red text-white">
              Live
            </Badge>
          </div>
        </div>
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-amber-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">Layoffs</div>
            <div className="bg-amber-100 p-2 rounded-full">
              <Briefcase className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">{stats.layoffs}</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-amber-600 text-white">
              Live
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeStats;
