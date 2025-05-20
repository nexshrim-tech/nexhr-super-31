
export interface Expense {
  expenseid: string;
  employeeid: string;
  customerid: string;
  amount: number;
  submittedby: string;
  submissiondate: string;
  description: string;
  category: string;
  status: string;
  billpath?: string;
  // Adding date field to match usage in Expenses.tsx
  date: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  budget?: number;
  spent?: number;
  color?: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
  byStatus: Record<string, number>;
  topExpenses: Expense[];
}
