
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { PayslipRecord } from "@/types/salary";

interface PayslipHistoryProps {
  payslips: PayslipRecord[];
  onViewPayslip?: (payslipId: string) => void;
}

const PayslipHistory: React.FC<PayslipHistoryProps> = ({ payslips, onViewPayslip }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Payslips</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payslip ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.map((payslip) => (
              <TableRow key={payslip.id}>
                <TableCell>{payslip.id}</TableCell>
                <TableCell>{payslip.employee}</TableCell>
                <TableCell>{payslip.period}</TableCell>
                <TableCell>₹{payslip.amount.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(payslip.date), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onViewPayslip && (
                      <Button variant="ghost" size="icon" onClick={() => onViewPayslip(payslip.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PayslipHistory;
