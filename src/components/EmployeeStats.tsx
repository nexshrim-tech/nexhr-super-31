
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDepartments } from "@/services/departmentService";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeStatsProps {
  customerId?: number | null;
  employeeCount?: number;
  isLoading?: boolean;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ 
  customerId, 
  employeeCount = 0,
  isLoading = false 
}) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentStats, setDepartmentStats] = useState<{ [key: string]: number }>({});
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [onLeaveEmployees, setOnLeaveEmployees] = useState(0);
  const [localIsLoading, setLocalIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (customerId) {
        try {
          const departmentData = await getDepartments(customerId);
          setDepartments(departmentData);
          
          // Mock department stats for now
          // In a real implementation, you would fetch actual counts
          const stats: { [key: string]: number } = {};
          departmentData.forEach(dept => {
            stats[dept.name] = Math.floor(Math.random() * 10) + 1;
          });
          
          setDepartmentStats(stats);
          setActiveEmployees(employeeCount > 0 ? Math.floor(employeeCount * 0.85) : 28);
          setOnLeaveEmployees(employeeCount > 0 ? Math.floor(employeeCount * 0.15) : 4);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
        } finally {
          setLocalIsLoading(false);
        }
      } else {
        setLocalIsLoading(false);
      }
    };

    fetchDepartments();
  }, [customerId, employeeCount]);

  const isDataLoading = isLoading || localIsLoading;

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              Employee Statistics
            </h3>
            <TabsList className="bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
              {isDataLoading ? (
                <>
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600 mb-1">Total Employees</div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold text-gray-800">{employeeCount}</div>
                      <div className="text-xs bg-blue-500 text-white rounded-full px-2 py-1">
                        Total
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600 mb-1">Active</div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold text-gray-800">{activeEmployees}</div>
                      <div className="text-xs bg-green-500 text-white rounded-full px-2 py-1">
                        {employeeCount > 0 ? Math.round((activeEmployees / employeeCount) * 100) : 0}%
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-green-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${employeeCount > 0 ? (activeEmployees / employeeCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100 hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600 mb-1">On Leave</div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold text-gray-800">{onLeaveEmployees}</div>
                      <div className="text-xs bg-amber-500 text-white rounded-full px-2 py-1">
                        {employeeCount > 0 ? Math.round((onLeaveEmployees / employeeCount) * 100) : 0}%
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${employeeCount > 0 ? (onLeaveEmployees / employeeCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="departments" className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
              {isDataLoading ? (
                [...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))
              ) : departments.length > 0 ? (
                departments.map((dept, index) => (
                  <div 
                    key={dept.departmentid || index} 
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border hover:shadow-md transition-shadow"
                  >
                    <div className="text-sm text-gray-600 mb-1">{dept.name}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-gray-800">
                        {departmentStats[dept.name] || 0}
                      </div>
                      <div className="text-xs bg-gray-500 text-white rounded-full px-2 py-1">
                        {employeeCount > 0 ? Math.round(((departmentStats[dept.name] || 0) / employeeCount) * 100) : 0}%
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-500 rounded-full" 
                        style={{ width: `${employeeCount > 0 ? ((departmentStats[dept.name] || 0) / employeeCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No departments found. Create departments to see statistics here.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeStats;
