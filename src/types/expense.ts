
export interface Expense {
  expenseid: string;
  description: string;
  category: string;
  amount: number;
  submissiondate: string;
  status: string;
  billpath?: string;
  employeeid?: string;
  customerid?: string;
  customer_id?: string;
  date?: string; // Add this field for compatibility
}

export interface ExpenseItem {
  id: string;
  description: string;
  category: string;
  amount: number;
  submittedBy: {
    name: string;
    avatar: string;
  };
  date: string;
  status: string;
  expenseid: string;
  billpath?: string;
}

export interface ExpenseCategory {
  name: string;
  count: number;
  amount: number;
}

export interface ExpenseFormData {
  description: string;
  category: string;
  amount: number;
  date: string;
  receipt?: File;
}
