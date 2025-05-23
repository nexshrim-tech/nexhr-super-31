
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseHistoryTab from "@/components/expense/ExpenseHistoryTab";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getEmployeeById } from "@/services/employeeService";

export interface ExpenseItem {
  id: string;
  description: string;
  category: string;
  amount: number;
  submittedBy: { name: string; avatar: string };
  date: string;
  status: string;
  attachmentType?: string;
  expenseid?: string;
  billpath?: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Query expense table without submittedby field since it doesn't exist in the schema
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
              const employee = await getEmployeeById(expense.employeeid);
              if (employee) {
                submitterName = `${employee.firstname} ${employee.lastname}`;
                avatarText = `${employee.firstname?.charAt(0)}${employee.lastname?.charAt(0)}`.toUpperCase();
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

  const handleViewExpense = (expense: ExpenseItem) => {
    console.log('Viewing expense:', expense);
    toast({
      title: 'Expense Details',
      description: `Viewing expense: ${expense.description}`,
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Expense Management</h1>
              <p className="text-gray-500">Track and manage employee expenses</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>

          <Tabs defaultValue="history" className="space-y-4">
            <TabsList>
              <TabsTrigger value="history">Expense History</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <ExpenseHistoryTab 
                expenseHistory={expenses}
                onViewExpense={handleViewExpense}
              />
            </TabsContent>

            <TabsContent value="reports">
              <div className="text-center py-8">
                <p className="text-gray-500">Expense reports coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="text-center py-8">
                <p className="text-gray-500">Expense settings coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
