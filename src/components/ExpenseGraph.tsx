
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Area } from "recharts";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";

interface ExpenseData {
  name: string;
  amount: number;
}

const ExpenseGraph = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("all");
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [percentChange, setPercentChange] = useState<number>(0);
  
  useEffect(() => {
    const fetchExpenseData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        let startDate;
        
        if (timeRange === "7d") {
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
        } else if (timeRange === "30d") {
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 30);
        } else {
          // For "all", get the entire year
          startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        }
        
        // Fetch expenses in the date range
        const { data: expenses, error } = await supabase
          .from('expense')
          .select('*')
          .gte('submissiondate', startDate.toISOString())
          .lte('submissiondate', now.toISOString())
          .order('submissiondate', { ascending: true });
          
        if (error) {
          console.error('Error fetching expense data:', error);
          return;
        }
        
        // Process the data
        const processedData = processExpenseData(expenses, timeRange);
        setExpenseData(processedData.chartData);
        setTotalExpenses(processedData.total);
        
        // Calculate percent change
        const previousPeriodTotal = await calculatePreviousPeriodTotal(timeRange);
        if (previousPeriodTotal > 0) {
          const change = ((processedData.total - previousPeriodTotal) / previousPeriodTotal) * 100;
          setPercentChange(parseFloat(change.toFixed(1)));
        } else {
          setPercentChange(0);
        }
        
      } catch (error) {
        console.error('Error in expense data processing:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenseData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('expense-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expense'
        },
        () => {
          // Refetch data when expenses change
          fetchExpenseData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeRange]);
  
  // Process the raw expense data into chart format
  const processExpenseData = (expenses: any[], timeRange: string) => {
    const chartData: ExpenseData[] = [];
    let total = 0;
    
    if (!expenses || expenses.length === 0) {
      // Return default data if no expenses
      if (timeRange === "7d") {
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          chartData.push({
            name: format(date, 'MMM dd'),
            amount: 0
          });
        }
      } else if (timeRange === "30d") {
        for (let i = 0; i < 30; i += 5) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          chartData.push({
            name: format(date, 'MMM dd'),
            amount: 0
          });
        }
      } else {
        // All time - use months
        for (let i = 0; i < 12; i++) {
          chartData.push({
            name: format(new Date(new Date().getFullYear(), i, 1), 'MMM'),
            amount: 0
          });
        }
      }
      return { chartData, total: 0 };
    }
    
    // Group expenses by time period
    if (timeRange === "7d") {
      // Group by day for 7 days
      const dailyExpenses = new Map<string, number>();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyExpenses.set(format(date, 'yyyy-MM-dd'), 0);
      }
      
      expenses.forEach(expense => {
        const date = format(parseISO(expense.submissiondate), 'yyyy-MM-dd');
        if (dailyExpenses.has(date)) {
          dailyExpenses.set(date, (dailyExpenses.get(date) || 0) + Number(expense.amount));
        }
        total += Number(expense.amount);
      });
      
      Array.from(dailyExpenses.entries()).forEach(([date, amount]) => {
        chartData.push({
          name: format(parseISO(date), 'MMM dd'),
          amount
        });
      });
      
    } else if (timeRange === "30d") {
      // Group by 5-day periods
      const periodExpenses = new Map<string, number>();
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i * 5);
        periodExpenses.set(format(date, 'MMM dd'), 0);
      }
      
      expenses.forEach(expense => {
        const submissionDate = parseISO(expense.submissiondate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
        const period = Math.floor(daysDiff / 5);
        
        if (period < 6) {
          const periodDate = new Date();
          periodDate.setDate(periodDate.getDate() - period * 5);
          const periodKey = format(periodDate, 'MMM dd');
          
          periodExpenses.set(periodKey, (periodExpenses.get(periodKey) || 0) + Number(expense.amount));
        }
        total += Number(expense.amount);
      });
      
      Array.from(periodExpenses.entries()).reverse().forEach(([date, amount]) => {
        chartData.push({ name: date, amount });
      });
      
    } else {
      // Group by month for all time
      const monthlyExpenses = new Map<string, number>();
      
      for (let i = 0; i < 12; i++) {
        const month = format(new Date(new Date().getFullYear(), i, 1), 'MMM');
        monthlyExpenses.set(month, 0);
      }
      
      expenses.forEach(expense => {
        const month = format(parseISO(expense.submissiondate), 'MMM');
        monthlyExpenses.set(month, (monthlyExpenses.get(month) || 0) + Number(expense.amount));
        total += Number(expense.amount);
      });
      
      Array.from(monthlyExpenses.entries()).forEach(([month, amount]) => {
        chartData.push({ name: month, amount });
      });
    }
    
    return { chartData, total };
  };
  
  // Calculate total expenses from previous period for comparison
  const calculatePreviousPeriodTotal = async (currentTimeRange: string) => {
    try {
      const now = new Date();
      let currentPeriodStart, previousPeriodStart, previousPeriodEnd;
      
      if (currentTimeRange === "7d") {
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(currentPeriodStart.getDate() - 7);
        
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        
      } else if (currentTimeRange === "30d") {
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);
        
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        
      } else {
        // For "all" - compare with previous year
        const currentYear = now.getFullYear();
        currentPeriodStart = new Date(currentYear, 0, 1); // Jan 1 of current year
        
        previousPeriodStart = new Date(currentYear - 1, 0, 1); // Jan 1 of previous year
        previousPeriodEnd = new Date(currentYear - 1, 11, 31); // Dec 31 of previous year
      }
      
      const { data: previousExpenses, error } = await supabase
        .from('expense')
        .select('amount')
        .gte('submissiondate', previousPeriodStart.toISOString())
        .lte('submissiondate', previousPeriodEnd.toISOString());
        
      if (error) {
        console.error('Error fetching previous period expenses:', error);
        return 0;
      }
      
      return previousExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
    } catch (error) {
      console.error('Error calculating previous period total:', error);
      return 0;
    }
  };
  
  // Use dummy data if no real data is available
  const displayData = expenseData.length > 0 ? expenseData : [
    { name: "Jan", amount: 200 },
    { name: "Feb", amount: 250 },
    { name: "Mar", amount: 270 },
    { name: "Apr", amount: 400 },
    { name: "May", amount: 500 },
    { name: "Jun", amount: 480 },
    { name: "Jul", amount: 520 },
    { name: "Aug", amount: 480 },
    { name: "Sep", amount: 550 },
    { name: "Oct", amount: 600 },
    { name: "Nov", amount: 650 },
    { name: "Dec", amount: 700 },
  ];
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="dashboard-card border-t-2 border-t-nexhr-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-full">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Expense Graph</CardTitle>
              <p className="text-xs text-muted-foreground">Real-time expense data</p>
            </div>
          </div>
          <div className="flex items-center">
            <Tabs defaultValue={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <TabsList className="bg-muted">
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4 p-3 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-nexhr-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Total Expenses</div>
              <div className="text-xl font-semibold flex items-center gap-2">
                {formatCurrency(totalExpenses)}
                <span className={`text-sm ${percentChange >= 0 ? 'text-nexhr-green' : 'text-nexhr-red'}`}>
                  {percentChange > 0 ? '+' : ''}{percentChange}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              {timeRange === "7d" 
                ? "Last 7 days" 
                : timeRange === "30d" 
                  ? "Last 30 days" 
                  : "Annual Summary"}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nexhr-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading expense data...</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3944BC" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3944BC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }}
                  formatter={(value) => [`${formatCurrency(value as number)}`, 'Amount']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3944BC"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseGraph;
