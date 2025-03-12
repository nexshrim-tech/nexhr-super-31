
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const expensesData = [
  { name: "Jan", amount: 12000 },
  { name: "Feb", amount: 15000 },
  { name: "Mar", amount: 14000 },
  { name: "Apr", amount: 18000 },
  { name: "May", amount: 16000 },
  { name: "Jun", amount: 19000 },
  { name: "Jul", amount: 21000 },
  { name: "Aug", amount: 18000 },
];

const expenses = [
  {
    id: 1,
    description: "Office Supplies",
    category: "Office Expenses",
    amount: 250.00,
    submittedBy: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-08-01",
    status: "Approved",
  },
  {
    id: 2,
    description: "Team Lunch",
    category: "Meals & Entertainment",
    amount: 150.00,
    submittedBy: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-08-02",
    status: "Pending",
  },
  {
    id: 3,
    description: "Software Subscription",
    category: "Software",
    amount: 99.99,
    submittedBy: { name: "Lana Steiner", avatar: "LS" },
    date: "2023-08-03",
    status: "Approved",
  },
  {
    id: 4,
    description: "Travel to Client",
    category: "Travel",
    amount: 350.00,
    submittedBy: { name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-08-04",
    status: "Rejected",
  },
  {
    id: 5,
    description: "Office Furniture",
    category: "Office Expenses",
    amount: 750.00,
    submittedBy: { name: "Candice Wu", avatar: "CW" },
    date: "2023-08-05",
    status: "Approved",
  },
];

const Expenses = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Expenses</h1>
              <p className="text-gray-500">Track and manage company expenses</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$120,345.67</div>
                <p className="text-sm text-gray-500">Year to Date</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$3,250.00</div>
                <p className="text-sm text-gray-500">5 expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$18,000.00</div>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600">↑ 5.3%</span> vs last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Monthly Expenses</CardTitle>
                  <Tabs defaultValue="ytd">
                    <TabsList>
                      <TabsTrigger value="ytd">YTD</TabsTrigger>
                      <TabsTrigger value="6m">6M</TabsTrigger>
                      <TabsTrigger value="1m">1M</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={expensesData}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div>Office Expenses</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">$45,600</div>
                      <div className="text-sm text-gray-500">38%</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <div>Travel</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">$26,400</div>
                      <div className="text-sm text-gray-500">22%</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>Software</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">$19,200</div>
                      <div className="text-sm text-gray-500">16%</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div>Meals & Entertainment</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">$12,000</div>
                      <div className="text-sm text-gray-500">10%</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div>Other</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">$16,800</div>
                      <div className="text-sm text-gray-500">14%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Expenses</CardTitle>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" alt={expense.submittedBy.name} />
                              <AvatarFallback>{expense.submittedBy.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{expense.submittedBy.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              expense.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : expense.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
