
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AnalyticsSummary {
  totalEmployees: number;
  activeEmployees: number;
  departmentCounts: { name: string; count: number }[];
  recentHires: any[];
  genderDistribution: { male: number; female: number; other: number };
  attendanceSummary: { present: number; absent: number; late: number };
}

export const useEmployeeAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentCounts: [],
    recentHires: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
    attendanceSummary: { present: 0, absent: 0, late: 0 }
  });
  const { customerId } = useAuth();
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    if (!customerId) return;
    
    setLoading(true);
    try {
      // Fetch total employees
      const { data: employeeData, error: employeeError } = await supabase
        .from('employee')
        .select('employeeid, gender, joiningdate, firstname, lastname, profilepicturepath, jobtitle')
        .eq('customerid', customerId);

      if (employeeError) throw employeeError;

      // Get department data
      const { data: departmentData, error: departmentError } = await supabase
        .from('department')
        .select('departmentid, departmentname')
        .eq('customerid', customerId);

      if (departmentError) throw departmentError;

      // Get today's attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('customerid', customerId)
        .gte('checkintimestamp', today.toISOString());

      if (attendanceError) throw attendanceError;

      // Process and set analytics data
      const totalEmployees = employeeData?.length || 0;
      const activeEmployees = totalEmployees; // Assuming all employees are active

      // Department distribution
      const departmentCounts: { name: string; count: number }[] = [];
      if (departmentData) {
        departmentData.forEach(dept => {
          const count = employeeData?.filter(emp => emp.department === dept.departmentid).length || 0;
          departmentCounts.push({ 
            name: dept.departmentname || 'Unknown', 
            count 
          });
        });
      }

      // Gender distribution
      const genderDistribution = {
        male: employeeData?.filter(emp => emp.gender?.toLowerCase() === 'male').length || 0,
        female: employeeData?.filter(emp => emp.gender?.toLowerCase() === 'female').length || 0,
        other: employeeData?.filter(emp => emp.gender?.toLowerCase() !== 'male' && emp.gender?.toLowerCase() !== 'female').length || 0
      };

      // Recent hires (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentHires = employeeData?.filter(emp => {
        const joinDate = emp.joiningdate ? new Date(emp.joiningdate) : null;
        return joinDate && joinDate >= thirtyDaysAgo;
      }).slice(0, 5) || [];

      // Attendance summary
      const presentCount = attendanceData?.filter(att => att.status?.toLowerCase() === 'present').length || 0;
      const absentCount = totalEmployees - presentCount;
      const lateCount = attendanceData?.filter(att => att.status?.toLowerCase() === 'late').length || 0;

      setAnalytics({
        totalEmployees,
        activeEmployees,
        departmentCounts,
        recentHires,
        genderDistribution,
        attendanceSummary: {
          present: presentCount,
          absent: absentCount,
          late: lateCount
        }
      });

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error fetching analytics',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchAnalytics();
    }
  }, [customerId]);

  return {
    loading,
    analytics,
    refreshAnalytics: fetchAnalytics
  };
};
