
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

const data = [
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

const ExpenseGraph = () => {
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
              <p className="text-xs text-muted-foreground">1 Jan 2024 - 26 Aug 2024</p>
            </div>
          </div>
          <div className="flex items-center">
            <Tabs defaultValue="all">
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
                $220,342.76
                <span className="text-nexhr-green text-sm">+4.5%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Annual Summary</div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
                domain={[0, 800]} 
                ticks={[0, 200, 400, 600, 800]} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }}
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
      </CardContent>
    </Card>
  );
};

export default ExpenseGraph;
