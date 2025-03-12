
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">Expense Graph</CardTitle>
            <p className="text-xs text-muted-foreground">1 jan 2024 - 26 aug 2024</p>
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
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-medium flex items-center gap-2">
            220,342.76
            <span className="text-nexhr-green text-sm">+4.5%</span>
          </div>
          <div className="text-sm text-muted-foreground">area graph</div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 800]} 
                ticks={[0, 200, 400, 600, 800]} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3944BC"
                fill="#3944BC"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseGraph;
