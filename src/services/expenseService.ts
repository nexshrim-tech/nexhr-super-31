
import { supabase } from '@/integrations/supabase/client';

export interface Expense {
  expenseid: number;
  employeeid?: number;
  customerid?: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: string;
  attachmentpath?: string;
  submittedby: string;
  approvedby?: string;
  notes?: string;
}

export const getExpenses = async (customerId?: number): Promise<Expense[]> => {
  try {
    let query = supabase
      .from('expense')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getExpenses:', error);
    throw error;
  }
};

export const getExpenseById = async (id: number): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from('expense')
      .select('*')
      .eq('expenseid', id)
      .single();

    if (error) {
      console.error('Error fetching expense by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getExpenseById:', error);
    throw error;
  }
};

export const addExpense = async (expense: Omit<Expense, 'expenseid'>): Promise<Expense> => {
  try {
    const { data, error } = await supabase
      .from('expense')
      .insert([expense])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addExpense:', error);
    throw error;
  }
};

export const updateExpense = async (id: number, expense: Omit<Partial<Expense>, 'expenseid'>): Promise<Expense> => {
  try {
    const { data, error } = await supabase
      .from('expense')
      .update(expense)
      .eq('expenseid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating expense:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateExpense:', error);
    throw error;
  }
};

export const deleteExpense = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('expense')
      .delete()
      .eq('expenseid', id);

    if (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteExpense:', error);
    throw error;
  }
};
