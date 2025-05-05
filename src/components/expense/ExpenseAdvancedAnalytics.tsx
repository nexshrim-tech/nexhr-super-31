
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ArrowUpRight, TrendingUp, DollarSign, Calendar, IndianRupee } from 'lucide-react';

interface ExpenseDataPoint {
  id: number;
  description: string;
  category: string;
  amount: number;
  submittedBy: { name: string; avatar: string };
  date: string;
  status: string;
}

interface ExpenseAdvancedAnalyticsProps {
  expenses: ExpenseDataPoint[];
}

const ExpenseAdvancedAnalytics: React.FC<ExpenseAdvancedAnalyticsProps> = ({ expenses }) => {
  // Calculate monthly expenses data
  const getMonthlyExpenseData = () => {
    const monthlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      
      if (expense.status === "Approved") {
        monthlyData[monthYear] += expense.amount;
      }
    });
    
    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split('-');
        const [bMonth, bYear] = b.name.split('-');
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
      })
      .slice(-12); // Get last 12 months
  };
  
  // Calculate category expense distribution data
  const getCategoryExpenseData = () => {
    const categoryData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (expense.status === "Approved") {
        if (!categoryData[expense.category]) {
          categoryData[expense.category] = 0;
        }
        categoryData[expense.category] += expense.amount;
      }
    });
    
    // Convert to array and sort by amount
    return Object.entries(categoryData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  // Calculate expense status distribution
  const getStatusDistributionData = () => {
    const statusCount: Record<string, number> = {
      "Approved": 0,
      "Pending": 0,
      "Rejected": 0
    };
    
    expenses.forEach(expense => {
      if (statusCount[expense.status] !== undefined) {
        statusCount[expense.status]++;
      }
    });
    
    return Object.entries(statusCount)
      .map(([name, value]) => ({ name, value }));
  };
  
  // Calculate expense trends by quarter
  const getQuarterlyTrendData = () => {
    const quarterlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (expense.status === "Approved") {
        const date = new Date(expense.date);
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const key = `Q${quarter} ${year}`;
        
        if (!quarterlyData[key]) {
          quarterlyData[key] = 0;
        }
        
        quarterlyData[key] += expense.amount;
      }
    });
    
    // Sort by year and quarter
    return Object.entries(quarterlyData)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => {
        const aYear = parseInt(a.name.split(' ')[1]);
        const bYear = parseInt(b.name.split(' ')[1]);
        
        if (aYear !== bYear) return aYear - bYear;
        
        const aQuarter = parseInt(a.name.split('Q')[1].split(' ')[0]);
        const bQuarter = parseInt(b.name.split('Q')[1].split(' ')[0]);
        
        return aQuarter - bQuarter;
      });
  };
  
  // Get top expenses
  const getTopExpenses = () => {
    return [...expenses]
      .filter(expense => expense.status === "Approved")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };
  
  const monthlyData = getMonthlyExpenseData();
  const categoryData = getCategoryExpenseData();
  const statusData = getStatusDistributionData();
  const quarterlyTrendData = getQuarterlyTrendData();
  const topExpenses = getTopExpenses();
  
  // Calculate total expense amount for approved expenses
  const totalExpenseAmount = expenses
    .filter(expense => expense.status === "Approved")
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate average expense amount
  const averageExpenseAmount = expenses.length > 0 ? 
    totalExpenseAmount / expenses.filter(expense => expense.status === "Approved").length : 0;
  
  // Calculate YoY growth
  const calculateYoYGrowth = () => {
    const currentYearExpenses = expenses
      .filter(expense => {
        const date = new Date(expense.date);
        const currentYear = new Date().getFullYear();
        return date.getFullYear() === currentYear && expense.status === "Approved";
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const lastYearExpenses = expenses
      .filter(expense => {
        const date = new Date(expense.date);
        const lastYear = new Date().getFullYear() - 1;
        return date.getFullYear() === lastYear && expense.status === "Approved";
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return lastYearExpenses > 0 ?
      ((currentYearExpenses - lastYearExpenses) / lastYearExpenses) * 100 : 0;
  };
  
  const yoyGrowth = calculateYoYGrowth();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];
  const STATUS_COLORS = {
    'Approved': '#16A34A',
    'Pending': '#FACC15',
    'Rejected': '#DC2626'
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {totalExpenseAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center mt-1 text-sm">
              <span className={yoyGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {yoyGrowth >= 0 ? "↑" : "↓"} {Math.abs(yoyGrowth).toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Average Expense</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {averageExpenseAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-muted-foreground text-sm mt-1">
              Based on {expenses.filter(expense => expense.status === "Approved").length} approved expenses
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Status Distribution</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                    label={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-1">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: STATUS_COLORS[status.name as keyof typeof STATUS_COLORS] }}
                  />
                  <span>{status.name}: {status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="category">Category Analysis</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Analysis</TabsTrigger>
          <TabsTrigger value="top">Top Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="Expense" 
                        stroke="#3944BC" 
                        strokeWidth={3} 
                        dot={{ fill: "#3944BC", r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No monthly expense data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]} />
                      <Bar 
                        dataKey="value" 
                        name="Amount" 
                        fill="#3944BC" 
                        radius={[0, 4, 4, 0]}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No category data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quarterly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quarterly Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {quarterlyTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quarterlyTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]} />
                      <Bar 
                        dataKey="amount" 
                        name="Quarterly Expense" 
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      >
                        {quarterlyTrendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No quarterly data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top 5 Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpenses.length > 0 ? (
                  topExpenses.map((expense, index) => (
                    <div key={expense.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-semibold flex items-center">
                        <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                        {expense.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No approved expenses found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseAdvancedAnalytics;
