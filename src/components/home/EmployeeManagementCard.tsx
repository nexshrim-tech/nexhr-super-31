
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getRemainingQuota } from '@/utils/subscriptionUtils';

const EmployeeManagementCard: React.FC = () => {
  const { features, plan } = useSubscription();
  const { customerId } = useAuth();
  
  const { data: employeeCount = 0, isLoading } = useQuery({
    queryKey: ['employeeCount', customerId],
    queryFn: async () => {
      if (!customerId) return 0;
      
      const { count, error } = await supabase
        .from('employee')
        .select('*', { count: 'exact', head: true })
        .eq('customerid', customerId);
        
      if (error) {
        console.error('Error fetching employee count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!customerId && features.employeeManagement
  });
  
  const remainingQuota = getRemainingQuota(plan, employeeCount);
  const canAddMore = remainingQuota > 0;
  
  if (!features.employeeManagement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>Employee Management</span>
          </CardTitle>
          <CardDescription>Manage your organization's personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="bg-amber-50 text-amber-800 rounded-lg p-4 mb-4">
              <p className="font-medium">Feature locked</p>
              <p className="text-sm">Subscribe to a plan to unlock employee management features</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/subscription'}
            variant="outline"
          >
            Upgrade to Unlock
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Employee Management</span>
        </CardTitle>
        <CardDescription>Manage your organization's personnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Employees</p>
                <p className="text-2xl font-bold">{isLoading ? '...' : employeeCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Remaining Quota</p>
                <p className="text-2xl font-bold">{isLoading ? '...' : remainingQuota}</p>
              </div>
            </div>
            
            {!canAddMore && (
              <div className="mt-3 text-center bg-amber-50 text-amber-800 rounded p-2 text-sm">
                You've reached your plan limit. Upgrade to add more employees.
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to="/all-employees" className="flex-1">
          <Button variant="outline" className="w-full">
            <Users className="mr-2 h-4 w-4" /> View All
          </Button>
        </Link>
        <Link to="/add-employee" className="flex-1">
          <Button 
            className="w-full" 
            disabled={!canAddMore}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EmployeeManagementCard;
