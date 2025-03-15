
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Download, FileImage, FileText, Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExpenseHistoryTab from "@/components/expense/ExpenseHistoryTab";
import ExpenseAdvancedAnalytics from "@/components/expense/ExpenseAdvancedAnalytics";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

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

const initialExpenses = [
  {
    id: 1,
    description: "Office Supplies",
    category: "Office Expenses",
    amount: 250.00,
    submittedBy: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-08-01",
    status: "Approved",
    attachmentType: "image",
  },
  {
    id: 2,
    description: "Team Lunch",
    category: "Meals & Entertainment",
    amount: 150.00,
    submittedBy: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-08-02",
    status: "Pending",
    attachmentType: "pdf",
  },
  {
    id: 3,
    description: "Software Subscription",
    category: "Software",
    amount: 99.99,
    submittedBy: { name: "Lana Steiner", avatar: "LS" },
    date: "2023-08-03",
    status: "Approved",
    attachmentType: "pdf",
  },
  {
    id: 4,
    description: "Travel to Client",
    category: "Travel",
    amount: 350.00,
    submittedBy: { name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-08-04",
    status: "Rejected",
    attachmentType: "image",
  },
  {
    id: 5,
    description: "Office Furniture",
    category: "Office Expenses",
    amount: 750.00,
    submittedBy: { name: "Candice Wu", avatar: "CW" },
    date: "2023-08-05",
    status: "Approved",
    attachmentType: "image",
  },
];

const expenseCategories = [
  "Office Expenses",
  "Meals & Entertainment",
  "Software",
  "Travel",
  "Equipment",
  "Marketing",
  "Training",
  "Utilities",
  "Rent",
  "Miscellaneous"
];

const historicalExpenses = [
  {
    id: 101,
    description: "Annual Software Licenses",
    category: "Software",
    amount: 2499.99,
    submittedBy: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-01-15",
    status: "Approved",
    attachmentType: "pdf",
  },
  {
    id: 102,
    description: "Quarterly Team Lunch",
    category: "Meals & Entertainment",
    amount: 560.75,
    submittedBy: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-02-22",
    status: "Approved",
    attachmentType: "image",
  },
  {
    id: 103,
    description: "Office Chairs (5)",
    category: "Office Expenses",
    amount: 1250.00,
    submittedBy: { name: "Lana Steiner", avatar: "LS" },
    date: "2023-03-10",
    status: "Approved",
    attachmentType: "pdf",
  },
  {
    id: 104,
    description: "Client Visit - Tokyo",
    category: "Travel",
    amount: 3750.50,
    submittedBy: { name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-04-05",
    status: "Approved",
    attachmentType: "pdf",
  },
  {
    id: 105,
    description: "Marketing Campaign",
    category: "Marketing",
    amount: 5000.00,
    submittedBy: { name: "Candice Wu", avatar: "CW" },
    date: "2023-05-18",
    status: "Approved",
    attachmentType: "pdf",
  },
  {
    id: 106,
    description: "Team Building Event",
    category: "Meals & Entertainment",
    amount: 1200.00,
    submittedBy: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-06-22",
    status: "Approved",
    attachmentType: "image",
  },
  {
    id: 107,
    description: "Office Renovation",
    category: "Office Expenses",
    amount: 8500.00,
    submittedBy: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-07-15",
    status: "Approved",
    attachmentType: "pdf",
  },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [activeTab, setActiveTab] = useState("all");
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [showExpenseAttachment, setShowExpenseAttachment] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [activeMainTab, setActiveMainTab] = useState("current");
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your expense data is being exported as CSV file.",
    });
    // In a real app, this would handle actual CSV export
  };

  const handleAddExpense = (formData: any) => {
    const newExpense = {
      id: expenses.length + 1,
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      submittedBy: { name: "Current User", avatar: "CU" },
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      attachmentType: formData.receipt ? "image" : "",
    };
    
    setExpenses([...expenses, newExpense]);
    setShowAddExpenseDialog(false);
    toast({
      title: "Expense Added",
      description: "Your expense has been submitted for approval.",
    });
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowExpenseAttachment(true);
  };

  const handleApproveExpense = (id: number) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: "Approved" } : exp
    ));
    toast({
      title: "Expense Approved",
      description: "The expense has been approved successfully.",
    });
  };

  const handleRejectExpense = (id: number) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: "Rejected" } : exp
    ));
    toast({
      title: "Expense Rejected",
      description: "The expense has been rejected.",
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    if (activeTab === "all") return true;
    return expense.status.toLowerCase() === activeTab.toLowerCase();
  });

  const allExpenses = [...expenses, ...historicalExpenses];

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
              <Button 
                className="flex items-center gap-2" 
                onClick={() => setShowAddExpenseDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExport}
              >
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

          <Tabs defaultValue="current" className="mb-6" onValueChange={setActiveMainTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="current">Current Expenses</TabsTrigger>
              <TabsTrigger value="history">Expense History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Expenses</CardTitle>
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
                        {filteredExpenses.map((expense) => (
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
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewExpense(expense)}
                                >
                                  View
                                </Button>
                                {expense.status === "Pending" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600"
                                      onClick={() => handleApproveExpense(expense.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600"
                                      onClick={() => handleRejectExpense(expense.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <ExpenseHistoryTab
                expenseHistory={allExpenses}
                onViewExpense={handleViewExpense}
              />
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Expenses</CardTitle>
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
            </TabsContent>
            
            <TabsContent value="advanced">
              <ExpenseAdvancedAnalytics expenses={allExpenses} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense for reimbursement.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              description: formData.get('description') as string,
              category: formData.get('category') as string,
              amount: formData.get('amount') as string,
              receipt: formData.get('receipt') as File,
            };
            handleAddExpense(data);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount ($)
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receipt" className="text-right">
                  Receipt
                </Label>
                <Input
                  id="receipt"
                  name="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit Expense</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showExpenseAttachment} onOpenChange={setShowExpenseAttachment}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Expense Receipt</DialogTitle>
            <DialogDescription>
              {selectedExpense?.description} - ${selectedExpense?.amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4 bg-gray-100 rounded-md min-h-[300px] items-center">
            {selectedExpense?.attachmentType === "image" ? (
              <div className="flex flex-col items-center">
                <FileImage className="h-24 w-24 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Image Preview (Placeholder)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="h-24 w-24 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">PDF Document (Placeholder)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
