
export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  employeeid?: string;
  customerid?: string;
  submittedby?: string;
  submissiondate?: string;
  status?: string;
  billpath?: string;
}
