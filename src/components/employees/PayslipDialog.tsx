import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "../ui/card";
import { saveAs } from "file-saver";

interface PayslipDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payslips: any[];
}

const PayslipDialog: React.FC<PayslipDialogProps> = ({
  isOpen,
  onOpenChange,
  payslips: initialPayslips,
}) => {
  const [payslips, setPayslips] = useState<any[]>(initialPayslips);
  const [loading, setLoading] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);
  
  // Fetch payslips if none are provided
  useEffect(() => {
    if (initialPayslips && initialPayslips.length > 0) {
      setPayslips(initialPayslips);
      return;
    }
    
    const fetchPayslips = async () => {
      setLoading(true);
      try {
        // Handle string employeeId for new data structure
        const { data, error } = await supabase
          .from('payslip')
          .select('*')
          .order('year', { ascending: false })
          .order('month', { ascending: false });
        
        if (error) throw error;
        setPayslips(data || []);
      } catch (error) {
        console.error('Error fetching payslips:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchPayslips();
    }
  }, [isOpen, initialPayslips]);
  
  // Reset selected payslip when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedPayslip(null);
    }
  }, [isOpen]);
  
  const getMonthName = (monthNumber: number) => {
    return new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
  };
  
  const handleViewPayslip = (payslip: any) => {
    setSelectedPayslip(payslip);
  };
  
  const handleDownloadPayslip = (payslip: any) => {
    const filename = `Payslip_${getMonthName(payslip.month)}_${payslip.year}.txt`;
    const content = `
PAYSLIP
========
Month: ${getMonthName(payslip.month)} ${payslip.year}
Amount: ${payslip.amount || 0}
Generated on: ${format(new Date(payslip.generatedtimestamp || Date.now()), 'PP')}
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  };
  
  // If viewing a specific payslip
  if (selectedPayslip) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payslip Details - {getMonthName(selectedPayslip.month)} {selectedPayslip.year}</DialogTitle>
          </DialogHeader>
          
          <Card className="border-2 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">ACME Corporation</h2>
                <p className="text-gray-500">Payslip for {getMonthName(selectedPayslip.month)} {selectedPayslip.year}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Employee ID</p>
                  <p className="font-medium">{selectedPayslip.employeeid}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Generated On</p>
                  <p className="font-medium">{format(new Date(selectedPayslip.generatedtimestamp || Date.now()), 'PP')}</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Gross Salary</span>
                  <span className="font-medium">₹{selectedPayslip.amount || 0}</span>
                </div>
                
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Deductions</span>
                  <span>₹0.00</span>
                </div>
              </div>
              
              <div className="flex justify-between py-4 font-bold">
                <span>Net Salary</span>
                <span>₹{selectedPayslip.amount || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setSelectedPayslip(null)}>
              Back to List
            </Button>
            <Button onClick={() => handleDownloadPayslip(selectedPayslip)}>
              <Download className="mr-2 h-4 w-4" />
              Download Payslip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Main payslip list view
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payslip History</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : payslips.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-1">No payslips found</h3>
            <p>Payslip records will appear here once they are generated.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.payslipid}>
                    <TableCell>
                      <div className="font-medium">{getMonthName(payslip.month)} {payslip.year}</div>
                    </TableCell>
                    <TableCell>₹{payslip.amount || 0}</TableCell>
                    <TableCell>
                      {payslip.generatedtimestamp 
                        ? format(new Date(payslip.generatedtimestamp), 'PP')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPayslip(payslip)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownloadPayslip(payslip)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PayslipDialog;
