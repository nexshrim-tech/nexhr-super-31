
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseHistoryTable from './ExpenseHistoryTable';
import ExpenseFilters from './ExpenseFilters';
import { DateRange } from 'react-day-picker';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";
import { IndianRupee } from "lucide-react";
import { getEmployeeById } from "@/services/employeeService";

export interface ExpenseItem {
  id: number;
  description: string;
  category: string;
  amount: number;
  submittedBy: { name: string; avatar: string };
  date: string;
  status: string;
  attachmentType?: string;
  expenseid?: number;
  billpath?: string;
}

interface ExpenseHistoryTabProps {
  expenseHistory?: ExpenseItem[];
  onViewExpense: (expense: ExpenseItem) => void;
}

const ExpenseHistoryTab: React.FC<ExpenseHistoryTabProps> = ({ expenseHistory = [], onViewExpense }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(expenseHistory);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>(expenses);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Extract unique categories from expense data
  const categories = Array.from(new Set(expenses.map(expense => expense.category)));

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        // Use simplified query that matches the actual schema
        const { data, error } = await supabase
          .from('expense')
          .select(`
            expenseid,
            description,
            category,
            amount,
            submissiondate,
            status,
            employeeid,
            billpath
          `);

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to match the ExpenseItem interface
          const formattedDataPromises = data.map(async (expense) => {
            // Get employee name if employeeid is present
            let submitterName = `Employee #${String(expense.employeeid)}`;
            let avatarText = 'UN';
            
            if (expense.employeeid) {
              try {
                // Convert to string for compatibility with the updated employeeid type
                const employee = await getEmployeeById(String(expense.employeeid));
                if (employee) {
                  submitterName = `${employee.firstname} ${employee.lastname}`;
                  avatarText = `${employee.firstname.charAt(0)}${employee.lastname.charAt(0)}`.toUpperCase();
                }
              } catch (err) {
                console.error('Error fetching employee details:', err);
              }
            }
            
            return {
              id: expense.expenseid,
              description: expense.description || '',
              category: expense.category || 'Uncategorized',
              amount: expense.amount || 0,
              submittedBy: { 
                name: submitterName,
                avatar: avatarText
              },
              date: expense.submissiondate ? new Date(expense.submissiondate).toISOString().split('T')[0] : '',
              status: expense.status || 'Pending',
              expenseid: expense.expenseid,
              billpath: expense.billpath
            };
          });
          
          const formattedData = await Promise.all(formattedDataPromises);
          setExpenses(formattedData);
          setFilteredExpenses(formattedData);
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

  const handleFilter = (filters: {
    search: string;
    category: string;
    status: string;
    dateRange: DateRange | undefined;
    minAmount: number | undefined;
    maxAmount: number | undefined;
  }) => {
    const filtered = expenses.filter(expense => {
      // Search filter
      if (filters.search && !expense.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && filters.category !== "all" && expense.category !== filters.category) {
        return false;
      }
      
      // Status filter
      if (filters.status && filters.status !== "all" && expense.status !== filters.status) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange?.from) {
        const expenseDate = new Date(expense.date);
        const from = new Date(filters.dateRange.from);
        from.setHours(0, 0, 0, 0);
        
        if (expenseDate < from) {
          return false;
        }
        
        if (filters.dateRange.to) {
          const to = new Date(filters.dateRange.to);
          to.setHours(23, 59, 59, 999);
          
          if (expenseDate > to) {
            return false;
          }
        }
      }
      
      // Amount range filter
      if (filters.minAmount !== undefined && expense.amount < filters.minAmount) {
        return false;
      }
      
      if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) {
        return false;
      }
      
      return true;
    });
    
    setFilteredExpenses(filtered);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Expense History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExpenseFilters 
          onFilter={handleFilter}
          categories={categories}
        />
        <ExpenseHistoryTable 
          expenses={filteredExpenses}
          onViewExpense={onViewExpense}
          isLoading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default ExpenseHistoryTab;

export const updateExpense = async (expenseId: string, status: string, notes?: string) => {
  try {
    // Convert expenseId to the correct type for the database operation
    const { data, error } = await supabase
      .from('expense')
      .update({ status, notes })
      .eq('expenseid', expenseId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};
