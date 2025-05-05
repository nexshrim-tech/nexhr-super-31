import React, { useState, useEffect } from "react";
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
import { Download, FileImage, FileText, Plus, Upload, IndianRupee, Eye } from "lucide-react";
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
import ExpenseHistoryTab, { ExpenseItem } from "@/components/expense/ExpenseHistoryTab";
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
import { supabase } from "@/integrations/supabase/client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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

const Expenses = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [showExpenseAttachment, setShowExpenseAttachment] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [activeMainTab, setActiveMainTab] = useState("current");
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    total: 0,
    pending: 0,
    pendingCount: 0,
    monthlyTotal: 0,
    monthlyChange: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        // Use simplified query that doesn't try to join employee table
        const { data, error } = await supabase
          .from('expense')
          .select(`
            expenseid,
            description,
            category,
            amount,
            submissiondate,
            status,
            submittedby,
            billpath
          `);

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to match the ExpenseItem interface
          const formattedData: ExpenseItem[] = data.map(expense => ({
            id: expense.expenseid,
            description: expense.description || '',
            category: expense.category || 'Uncategorized',
            amount: parseFloat(expense.amount) || 0,
            submittedBy: { 
              // Fix the type error by properly converting submittedby to string
              name: expense.submittedby ? `Employee #${String(expense.submittedby)}` : 'Unknown',
              avatar: 'UN'
            },
            date: expense.submissiondate ? new Date(expense.submissiondate).toISOString().split('T')[0] : '',
            status: expense.status || 'Pending',
            expenseid: expense.expenseid,
            billpath: expense.billpath
          }));

          setExpenses(formattedData);
          
          // Calculate statistics
          const total = formattedData.reduce((sum, exp) => sum + exp.amount, 0);
          const pendingExpenses = formattedData.filter(exp => exp.status === 'Pending');
          const pendingTotal = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          // Calculate current month expenses
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const currentMonthExpenses = formattedData.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
          });
          const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          // Calculate previous month for comparison
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          const lastMonthExpenses = formattedData.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
          });
          const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          // Calculate percent change
          const percentChange = lastMonthTotal > 0 
            ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
            : 0;
            
          setTotalStats({
            total,
            pending: pendingTotal,
            pendingCount: pendingExpenses.length,
            monthlyTotal: currentMonthTotal,
            monthlyChange: percentChange
          });
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch expense data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('expense-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expense'
      }, () => {
        // Refetch data when expenses change
        fetchExpenses();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleExport = () => {
    if (expenses.length === 0) {
      toast({
        title: "No Data",
        description: "There are no expenses to export.",
        variant: "destructive",
      });
      return;
    }
    
    // Format data for export
    const exportData = expenses.map(expense => ({
      Description: expense.description,
      Category: expense.category,
      Amount: expense.amount,
      Status: expense.status,
      Date: expense.date,
      SubmittedBy: expense.submittedBy.name
    }));
    
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = `expense_report_${new Date().toISOString().split('T')[0]}`;
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { 'Expenses': ws }, SheetNames: ['Expenses'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
    
    toast({
      title: "Exporting Data",
      description: "Your expense data has been exported as Excel file.",
    });
  };

  const handleAddExpense = async (formData: any) => {
    try {
      // First check if we have any valid employees in the system
      const { data: employeeData, error: employeeError } = await supabase
        .from('employee')
        .select('employeeid')
        .limit(1);
        
      if (employeeError) {
        throw new Error('Error checking for employees');
      }
      
      // Set a valid submittedby or null if no employees exist
      const submittedBy = employeeData && employeeData.length > 0 
        ? employeeData[0].employeeid 
        : null;
      
      let billPath = null;
      
      // If there's a receipt file, upload it to storage
      if (formData.receipt && formData.receipt.size > 0) {
        const fileExt = formData.receipt.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('expense-bills')
          .upload(fileName, formData.receipt);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('expense-bills')
          .getPublicUrl(fileName);
          
        billPath = publicUrl;
      }
      
      const newExpense = {
        description: formData.description,
        category: formData.category,
        amount: parseFloat(formData.amount),
        submittedby: submittedBy, // Use a valid employeeid or null
        submissiondate: new Date().toISOString(),
        status: "Pending",
        billpath: billPath
      };
      
      const { data, error } = await supabase
        .from('expense')
        .insert(newExpense)
        .select();
        
      if (error) {
        throw error;
      }
      
      setShowAddExpenseDialog(false);
      toast({
        title: "Expense Added",
        description: "Your expense has been submitted for approval.",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add the expense. Make sure employee records exist in the system.',
        variant: 'destructive',
      });
    }
  };

  const handleViewExpense = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setShowExpenseAttachment(true);
  };

  const handleApproveExpense = async (id: number) => {
    try {
      const { error } = await supabase
        .from('expense')
        .update({ status: 'Approved' })
        .eq('expenseid', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Expense Approved",
        description: "The expense has been approved successfully.",
      });
    } catch (error) {
      console.error('Error approving expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the expense',
        variant: 'destructive',
      });
    }
  };

  const handleRejectExpense = async (id: number) => {
    try {
      const { error } = await supabase
        .from('expense')
        .update({ status: 'Rejected' })
        .eq('expenseid', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Expense Rejected",
        description: "The expense has been rejected.",
      });
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the expense',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadReceipt = async (billpath: string | undefined) => {
    if (!billpath) {
      toast({
        title: "No Receipt",
        description: "There is no receipt attached to this expense.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract file name from the public URL
      const fileName = billpath.split('/').pop();
      if (!fileName) {
        throw new Error("Invalid file path");
      }
      
      // Download the file
      const { data, error } = await supabase.storage
        .from('expense-bills')
        .download(fileName);
        
      if (error) {
        throw error;
      }
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Receipt Downloaded",
        description: "The receipt has been downloaded to your device.",
      });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: 'Error',
        description: 'Failed to download the receipt',
        variant: 'destructive',
      });
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    if (activeTab === "all") return true;
    return expense.status.toLowerCase() === activeTab.toLowerCase();
  });

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
                <div className="text-2xl font-semibold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {loading ? "..." : totalStats.total.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500">Year to Date</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {loading ? "..." : totalStats.pending.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500">
                  {loading ? "..." : totalStats.pendingCount} expense{totalStats.pendingCount !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {loading ? "..." : totalStats.monthlyTotal.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500">
                  {!loading && (
                    <span className={totalStats.monthlyChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {totalStats.monthlyChange >= 0 ? "↑" : "↓"} {Math.abs(totalStats.monthlyChange).toFixed(1)}%
                    </span>
                  )}
                  {!loading && " vs last month"}
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
                  {loading ? (
                    <div className="rounded-md border p-8 flex justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading expenses...</p>
                      </div>
                    </div>
                  ) : (
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
                          {filteredExpenses.length > 0 ? (
                            filteredExpenses.map((expense) => (
                              <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.description}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                                    {expense.amount.toFixed(2)}
                                  </div>
                                </TableCell>
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
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    {expense.status === "Pending" && (
                                      <>
                                        <Button 
                                          variant="success" 
                                          size="sm"
                                          onClick={() => handleApproveExpense(expense.id)}
                                        >
                                          Approve
                                        </Button>
                                        <Button 
                                          variant="danger" 
                                          size="sm"
                                          onClick={() => handleRejectExpense(expense.id)}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                No expense history found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <ExpenseHistoryTab
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
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
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
                          <div className="font-medium flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                            45,600
                          </div>
                          <div className="text-sm text-gray-500">38%</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <div>Travel</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                            26,400
                          </div>
                          <div className="text-sm text-gray-500">22%</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div>Software</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                            19,200
                          </div>
                          <div className="text-sm text-gray-500">16%</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div>Meals & Entertainment</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                            12,000
                          </div>
                          <div className="text-sm text-gray-500">10%</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div>Other</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                            16,800
                          </div>
                          <div className="text-sm text-gray-500">14%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <ExpenseAdvancedAnalytics expenses={expenses} />
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
                  Amount (₹)
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
              {selectedExpense?.description} - 
              <span className="flex items-center inline-flex">
                <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                {selectedExpense?.amount.toFixed(2)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4 bg-gray-100 rounded-md min-h-[300px] items-center">
            {selectedExpense?.billpath ? (
              <div className="flex flex-col items-center">
                {selectedExpense.billpath.toLowerCase().endsWith('.pdf') ? (
                  <FileText className="h-24 w-24 text-gray-400" />
                ) : (
                  <img 
                    src={selectedExpense.billpath} 
                    alt="Receipt" 
                    className="max-h-[300px] max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = ""; // Placeholder for error
                      e.currentTarget.alt = "Failed to load image";
                      // Show FileImage icon as fallback
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>';
                      }
                    }}
                  />
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {selectedExpense.billpath.toLowerCase().endsWith('.pdf') ? "PDF Document" : "Receipt Image"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="h-24 w-24 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No receipt available</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => handleDownloadReceipt(selectedExpense?.billpath)}
              disabled={!selectedExpense?.billpath}
            >
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
