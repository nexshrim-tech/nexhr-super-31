import React, { useState, useEffect } from 'react';
import SidebarNav from '@/components/SidebarNav';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/services/customerService';
import { Expense } from '@/types/expense';
import { Category } from '@/types/category';

const Expenses = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchExpenses();
      await fetchCategories();
    };

    fetchInitialData();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data: expensesData, error: expensesError } = await supabase
        .from('expense')
        .select('*')
        .order('submissiondate', { ascending: false });

      if (expensesError) {
        console.error("Error fetching expenses:", expensesError);
        toast({
          title: "Error",
          description: "Failed to fetch expenses: " + expensesError.message,
          variant: "destructive",
        });
        return;
      }

      // Convert and map data to the Expense interface
      const mappedExpenses: Expense[] = (expensesData || []).map(exp => ({
        expenseid: String(exp.expenseid),
        date: exp.submissiondate || new Date().toISOString(),
        description: exp.description || '',
        category: exp.category || '',
        amount: Number(exp.amount) || 0,
        employeeid: String(exp.employeeid || ''),
        customerid: String(exp.customerid || ''),
        submittedby: String(exp.submittedby || ''),
        submissiondate: exp.submissiondate,
        status: exp.status || '',
        billpath: exp.billpath
      }));

      setExpenses(mappedExpenses);
    } catch (error) {
      console.error("Error processing expenses:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while processing expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Since there's no category table in the database schema, 
      // we'll create some default categories or extract unique categories from expenses
      const uniqueCategories = [...new Set(expenses.map(exp => exp.category))].filter(Boolean);
      
      const defaultCategories: Category[] = [
        { id: '1', name: 'Food' },
        { id: '2', name: 'Transportation' },
        { id: '3', name: 'Office Supplies' },
        { id: '4', name: 'Utilities' },
        { id: '5', name: 'Others' }
      ];
      
      // Combine default categories with any unique categories from expenses
      const allCategories = [
        ...defaultCategories,
        ...uniqueCategories
          .filter(cat => !defaultCategories.some(dc => dc.name === cat))
          .map((cat, index) => ({ id: `custom-${index}`, name: cat }))
      ];
      
      setCategories(allCategories);
    } catch (error) {
      console.error("Error processing categories:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while processing categories",
        variant: "destructive",
      });
    }
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setExpenseToEdit(null);
  };

  const handleOpenEditDialog = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setExpenseToEdit(null);
  };

  const handleCreateExpense = async (newExpense: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expense')
        .insert({
          description: newExpense.description || '',
          category: newExpense.category || '',
          amount: newExpense.amount || 0,
          submissiondate: newExpense.date || new Date().toISOString(),
          employeeid: parseInt(String(newExpense.employeeid || '0')),
          customerid: parseInt(String(newExpense.customerid || '0'))
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating expense:", error);
        toast({
          title: "Error",
          description: "Failed to create expense: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Convert the returned data to match our Expense interface
      const createdExpense: Expense = {
        expenseid: String(data.expenseid),
        date: data.submissiondate || new Date().toISOString(),
        description: data.description || '',
        category: data.category || '',
        amount: Number(data.amount) || 0,
        employeeid: String(data.employeeid || ''),
        customerid: String(data.customerid || ''),
        submittedby: String(data.submittedby || ''),
        submissiondate: data.submissiondate || '',
        status: data.status || ''
      };

      setExpenses([...expenses, createdExpense]);
      toast({
        title: "Success",
        description: "Expense created successfully!",
      });
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating expense:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the expense",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      const { data, error } = await supabase
        .from('expense')
        .update({
          description: updatedExpense.description,
          category: updatedExpense.category,
          amount: updatedExpense.amount,
          submissiondate: updatedExpense.date
        })
        .eq('expenseid', updatedExpense.expenseid)
        .select()
        .single();

      if (error) {
        console.error("Error updating expense:", error);
        toast({
          title: "Error",
          description: "Failed to update expense: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Convert the returned data to match our Expense interface
      const updatedExpenseData: Expense = {
        expenseid: String(data.expenseid),
        date: data.submissiondate || new Date().toISOString(),
        description: data.description || '',
        category: data.category || '',
        amount: Number(data.amount) || 0,
        employeeid: String(data.employeeid || ''),
        customerid: String(data.customerid || ''),
        submittedby: String(data.submittedby || ''),
        submissiondate: data.submissiondate || '',
        status: data.status || ''
      };

      setExpenses(expenses.map(exp => exp.expenseid === updatedExpense.expenseid ? updatedExpenseData : exp));
      toast({
        title: "Success",
        description: "Expense updated successfully!",
      });
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the expense",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (expenseid: string) => {
    try {
      const { error } = await supabase
        .from('expense')
        .delete()
        .eq('expenseid', parseInt(expenseid));

      if (error) {
        console.error("Error deleting expense:", error);
        toast({
          title: "Error",
          description: "Failed to delete expense: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setExpenses(expenses.filter(exp => exp.expenseid !== expenseid));
      toast({
        title: "Success",
        description: "Expense deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the expense",
        variant: "destructive",
      });
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesDate = !date?.from ||
      (new Date(expense.date) >= date.from &&
        (!date.to || new Date(expense.date) <= date.to));

    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory;

    const matchesSearchTerm = expense.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesCategory && matchesSearchTerm;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Fix for the reducer that's causing TS errors by using a proper typed approach
  const categoryCounts: Record<string, number> = {};
  filteredExpenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const hasExpenses = expenses.length > 0;

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Expense Tracking</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Expenses</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date?.from ? (
                        date.to ? (
                          `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
                        ) : (
                          format(date.from, "PPP")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={handleDateChange}
                      disabled={{ before: new Date('2020-01-01') }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Category</Label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search expenses..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Expense List</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={handleOpenDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Create a new expense record.
                  </DialogDescription>
                </DialogHeader>
                <ExpenseForm
                  categories={categories}
                  onCreate={handleCreateExpense}
                  onClose={handleCloseDialog}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading expenses...</div>
              ) : hasExpenses ? (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map(expense => (
                        <TableRow key={expense.expenseid}>
                          <TableCell>{format(new Date(expense.date), 'PPP')}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(expense)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteExpense(expense.expenseid)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell>₹{totalExpenses.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-1">No expenses found</h3>
                  <p>Add new expenses to start tracking your spending.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Expense</DialogTitle>
                <DialogDescription>
                  Update the details of the selected expense.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm
                expense={expenseToEdit}
                categories={categories}
                onUpdate={handleUpdateExpense}
                onClose={handleCloseEditDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

interface ExpenseFormProps {
  expense?: Expense | null;
  categories: Category[];
  onCreate?: (expense: Partial<Expense>) => void;
  onUpdate?: (expense: Expense) => void;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, categories, onCreate, onUpdate, onClose }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(expense ? new Date(expense.date) : undefined);
  const [description, setDescription] = useState(expense ? expense.description : '');
  const [category, setCategory] = useState(expense ? expense.category : categories.length > 0 ? categories[0].name : '');
  const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');

  const handleSubmit = () => {
    if (!date || !description || !category || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const newExpense = {
      date: date.toISOString(),
      description,
      category,
      amount: parsedAmount,
    };

    if (expense && onUpdate) {
      onUpdate({ ...expense, ...newExpense });
    } else if (onCreate) {
      onCreate(newExpense);
    }

    onClose();
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? (
                format(date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={setDate}
              disabled={{ before: new Date('2020-01-01') }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          {expense ? 'Update Expense' : 'Create Expense'}
        </Button>
      </div>
    </div>
  );
};

export default Expenses;
