
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, Eye, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExpenseItem } from './ExpenseHistoryTab';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExpenseHistoryTableProps {
  expenses: ExpenseItem[];
  onViewExpense: (expense: ExpenseItem) => void;
  isLoading?: boolean;
}

const ExpenseHistoryTable: React.FC<ExpenseHistoryTableProps> = ({ expenses, onViewExpense, isLoading = false }) => {
  const { toast } = useToast();

  const handleDownload = async (expense: ExpenseItem) => {
    if (!expense.billpath) {
      toast({
        title: "No Receipt",
        description: "There is no receipt attached to this expense.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract file name and path from the public URL with the new structure
      const urlParts = expense.billpath.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Get the path part from the URL (handling both old and new structure)
      let filePath;
      
      // Handle the new structure (company/year/month/day/file.ext)
      if (urlParts.length >= 5) {
        // Attempt to get the company/YYYY/MM/DD/filename.ext structure
        const storageUrlParts = expense.billpath.split('expense-bills/');
        if (storageUrlParts.length > 1) {
          filePath = storageUrlParts[1];
        } else {
          // Fallback to just the filename
          filePath = fileName;
        }
      } else {
        // Handle the old structure (just filename)
        filePath = fileName;
      }
      
      if (!filePath) {
        throw new Error("Invalid file path");
      }
      
      // Download the file with the correct path
      const { data, error } = await supabase.storage
        .from('expense-bills')
        .download(filePath);
        
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
  
  if (isLoading) {
    return (
      <div className="rounded-md border p-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
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
          {expenses.length > 0 ? (
            expenses.map((expense) => (
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
                      onClick={() => onViewExpense(expense)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    {expense.billpath && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(expense)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
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
  );
};

export default ExpenseHistoryTable;
