
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRealtime } from '@/hooks/useRealtime';

export interface AnalyticsSummary {
  totalEmployees: number;
  activeEmployees: number;
  departmentCounts: { name: string; count: number }[];
  recentHires: any[];
  genderDistribution: { male: number; female: number; other: number };
  attendanceSummary: { present: number; absent: number; late: number };
}

export const useEmployeeAnalytics = () => {
  const { customerId } = useAuth();
  const { toast } = useToast();

  // Enable realtime updates for employee, department and attendance tables
  useRealtime('employee', ['INSERT', 'UPDATE', 'DELETE'], () => {
    // This will refetch the data when changes occur
    refetch();
  });

  useRealtime('department', ['INSERT', 'UPDATE', 'DELETE'], () => {
    refetch();
  });

  useRealtime('attendance', ['INSERT', 'UPDATE'], () => {
    refetch();
  });

  const fetchAnalytics = async () => {
    if (!customerId) {
      console.log('No customer ID found, returning default values');
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        departmentCounts: [],
        recentHires: [],
        genderDistribution: { male: 0, female: 0, other: 0 },
        attendanceSummary: { present: 0, absent: 0, late: 0 }
      };
    }
    
    console.log('Fetching analytics for customer ID:', customerId);
    
    // Fetch total employees
    const { data: employeeData, error: employeeError } = await supabase
      .from('employee')
      .select('employeeid, gender, joiningdate, firstname, lastname, profilepicturepath, jobtitle, department')
      .eq('customerid', customerId);

    if (employeeError) {
      console.error('Error fetching employee data:', employeeError);
      throw employeeError;
    }

    console.log('Employee data fetched:', employeeData?.length || 0, 'employees found');

    // Get department data
    const { data: departmentData, error: departmentError } = await supabase
      .from('department')
      .select('departmentid, departmentname')
      .eq('customerid', customerId);

    if (departmentError) {
      console.error('Error fetching department data:', departmentError);
      throw departmentError;
    }

    console.log('Department data fetched:', departmentData?.length || 0, 'departments found');

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .eq('customerid', customerId)
      .gte('checkintimestamp', today.toISOString());

    if (attendanceError) {
      console.error('Error fetching attendance data:', attendanceError);
      throw attendanceError;
    }

    console.log('Attendance data fetched:', attendanceData?.length || 0, 'attendance records found');

    // Process and set analytics data
    const totalEmployees = employeeData?.length || 0;
    const activeEmployees = totalEmployees; // Assuming all employees are active

    // Department distribution
    const departmentCounts: { name: string; count: number }[] = [];
    if (departmentData && employeeData) {
      departmentData.forEach(dept => {
        // Fix: Now we're correctly filtering employees by their department ID
        const count = employeeData.filter(emp => emp.department === dept.departmentid).length || 0;
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

    return {
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
    };
  };

  // Fix: Update React Query configuration to use meta.errorHandler for error handling
  const { data: analytics, isLoading: loading, refetch } = useQuery({
    queryKey: ['employee-analytics', customerId],
    queryFn: fetchAnalytics,
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    initialData: {
      totalEmployees: 0,
      activeEmployees: 0,
      departmentCounts: [],
      recentHires: [],
      genderDistribution: { male: 0, female: 0, other: 0 },
      attendanceSummary: { present: 0, absent: 0, late: 0 }
    },
    meta: {
      errorHandler: (error: any) => {
        console.error('Error fetching analytics:', error);
        toast({
          title: 'Error fetching analytics',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    }
  });

  return {
    loading,
    analytics,
    refreshAnalytics: refetch
  };
};
