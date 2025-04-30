
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatters";

interface SalaryStat {
  total: number;
  average: number;
  pending: number;
  previousMonthTotal: number;
  previousMonthAverage: number;
  previousMonthPending: number;
}

const SalaryStats = () => {
  const [stats, setStats] = useState<SalaryStat>({
    total: 0,
    average: 0,
    pending: 0,
    previousMonthTotal: 0,
    previousMonthAverage: 0,
    previousMonthPending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryStats = async () => {
      setLoading(true);
      try {
        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
        const currentYear = now.getFullYear();
        
        // Previous month
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Fetch salary data
        const { data: salaryData, error: salaryError } = await supabase
          .from('salary')
          .select('*');

        if (salaryError) {
          console.error('Error fetching salary data:', salaryError);
          return;
        }

        // Fetch payslip data
        const { data: currentMonthPayslips, error: payslipError } = await supabase
          .from('payslip')
          .select('*')
          .eq('month', currentMonth)
          .eq('year', currentYear);

        if (payslipError) {
          console.error('Error fetching payslip data:', payslipError);
          return;
        }

        // Fetch previous month payslips
        const { data: previousMonthPayslips, error: prevPayslipError } = await supabase
          .from('payslip')
          .select('*')
          .eq('month', previousMonth)
          .eq('year', previousYear);

        if (prevPayslipError) {
          console.error('Error fetching previous month payslip data:', prevPayslipError);
          return;
        }

        // Calculate total salary expense (sum of base salary for all employees)
        let total = 0;
        if (salaryData && salaryData.length > 0) {
          total = salaryData.reduce((sum, salary) => {
            return sum + (salary.basicsalary || 0);
          }, 0);
        }

        // Calculate average salary
        const average = salaryData && salaryData.length > 0 
          ? total / salaryData.length 
          : 0;

        // Calculate pending payments
        // Assuming a payment is pending if the employee has a salary but no payslip for the current month
        const employeesWithSalary = new Set(salaryData?.map(s => s.employeeid) || []);
        const employeesWithPayslip = new Set(currentMonthPayslips?.map(p => p.employeeid) || []);
        
        const pendingCount = Array.from(employeesWithSalary).filter(id => !employeesWithPayslip.has(id)).length;

        // Calculate previous month stats for comparison
        let previousMonthTotal = 0;
        if (previousMonthPayslips && previousMonthPayslips.length > 0) {
          previousMonthTotal = previousMonthPayslips.reduce((sum, payslip) => {
            return sum + (payslip.amount || 0);
          }, 0);
        }

        const previousMonthAverage = previousMonthPayslips && previousMonthPayslips.length > 0
          ? previousMonthTotal / previousMonthPayslips.length
          : 0;

        // Previous month pending would be the difference between previous month
        const previousEmployeesWithPayslip = new Set(previousMonthPayslips?.map(p => p.employeeid) || []);
        const previousMonthPending = Array.from(employeesWithSalary).filter(id => !previousEmployeesWithPayslip.has(id)).length;

        setStats({
          total,
          average,
          pending: pendingCount,
          previousMonthTotal,
          previousMonthAverage,
          previousMonthPending: previousMonthPending
        });

      } catch (error) {
        console.error('Error calculating salary stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryStats();

    // Set up real-time subscription for salary and payslip changes
    const salaryChannel = supabase
      .channel('salary-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary'
        },
        () => fetchSalaryStats()
      )
      .subscribe();

    const payslipChannel = supabase
      .channel('payslip-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payslip'
        },
        () => fetchSalaryStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salaryChannel);
      supabase.removeChannel(payslipChannel);
    };
  }, []);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loading salary data...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Salary Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{formatCurrency(stats.total)}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentageChange(stats.total, stats.previousMonthTotal) > 0 ? '+' : ''}
            {calculatePercentageChange(stats.total, stats.previousMonthTotal)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{formatCurrency(stats.average)}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentageChange(stats.average, stats.previousMonthAverage) > 0 ? '+' : ''}
            {calculatePercentageChange(stats.average, stats.previousMonthAverage)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pending - stats.previousMonthPending >= 0 ? '+' : ''}
            {stats.pending - stats.previousMonthPending} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryStats;
