
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/context/SubscriptionContext';
import EmployeeManagementCard from './EmployeeManagementCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeeAnalytics from '@/components/EmployeeAnalytics';
import { enableRealtime } from '@/utils/realtimeUtils';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { features } = useSubscription();
  const { toast } = useToast();
  
  // Enable realtime updates when dashboard loads
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        await enableRealtime();
      } catch (error) {
        console.error('Failed to setup realtime:', error);
      }
    };
    
    setupRealtime();
  }, []);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <EmployeeManagementCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Leave Management</CardTitle>
              </CardHeader>
              <CardContent>
                {features.leaveManagement ? (
                  <div className="text-center py-2">
                    <p>View and manage employee leave requests</p>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-gray-100 rounded">
                    <p>Feature locked - Upgrade to unlock</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                {features.attendanceTracking ? (
                  <div className="text-center py-2">
                    <p>Track employee attendance and time</p>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-gray-100 rounded">
                    <p>Feature locked - Upgrade to unlock</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Salary Management</CardTitle>
              </CardHeader>
              <CardContent>
                {features.salaryManagement ? (
                  <div className="text-center py-2">
                    <p>Manage employee compensation</p>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-gray-100 rounded">
                    <p>Feature locked - Upgrade to unlock</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                {features.documentGeneration ? (
                  <div className="text-center py-2">
                    <p>Generate and manage employee documents</p>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-gray-100 rounded">
                    <p>Feature locked - Upgrade to unlock</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Management</CardTitle>
              </CardHeader>
              <CardContent>
                {features.employeeManagement ? (
                  <div className="text-center py-2">
                    <p>Organize and manage departments</p>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-gray-100 rounded">
                    <p>Feature locked - Upgrade to unlock</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <EmployeeAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
