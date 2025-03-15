
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseHistoryTable from './ExpenseHistoryTable';
import ExpenseFilters from './ExpenseFilters';
import { DateRange } from 'react-day-picker';

interface ExpenseItem {
  id: number;
  description: string;
  category: string;
  amount: number;
  submittedBy: { name: string; avatar: string };
  date: string;
  status: string;
  attachmentType?: string;
}

interface ExpenseHistoryTabProps {
  expenseHistory: ExpenseItem[];
  onViewExpense: (expense: ExpenseItem) => void;
}

const ExpenseHistoryTab: React.FC<ExpenseHistoryTabProps> = ({ expenseHistory, onViewExpense }) => {
  const [filteredExpenses, setFilteredExpenses] = useState(expenseHistory);
  
  // Extract unique categories from expense data
  const categories = Array.from(new Set(expenseHistory.map(expense => expense.category)));

  const handleFilter = (filters: {
    search: string;
    category: string;
    status: string;
    dateRange: DateRange | undefined;
    minAmount: number | undefined;
    maxAmount: number | undefined;
  }) => {
    const filtered = expenseHistory.filter(expense => {
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
        />
      </CardContent>
    </Card>
  );
};

export default ExpenseHistoryTab;
