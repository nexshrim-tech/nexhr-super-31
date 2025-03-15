
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LeaveHistoryItem {
  id: number;
  employeeId?: string;
  employee?: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
  balance?: number;
}

interface LeaveHistoryTableProps {
  historyData: LeaveHistoryItem[];
  showEmployee?: boolean;
  showLeaveBalance?: boolean;
  onUpdateLeaveBalance?: (id: number, type: string, newBalance: number) => void;
}

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ 
  historyData, 
  showEmployee = false, 
  showLeaveBalance = false,
  onUpdateLeaveBalance
}) => {
  const [editingLeave, setEditingLeave] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);

  const handleEditClick = (item: LeaveHistoryItem) => {
    setEditingLeave(item.id);
    setNewBalance(item.balance || 0);
  };

  const handleSaveBalance = (id: number, type: string) => {
    if (onUpdateLeaveBalance) {
      onUpdateLeaveBalance(id, type, newBalance);
    }
    setEditingLeave(null);
  };

  const handleCancelEdit = () => {
    setEditingLeave(null);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showEmployee && <TableHead>Employee ID</TableHead>}
            {showEmployee && <TableHead>Employee</TableHead>}
            <TableHead>Leave Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date Period</TableHead>
            <TableHead>Status</TableHead>
            {showLeaveBalance && <TableHead>Balance</TableHead>}
            {showLeaveBalance && onUpdateLeaveBalance && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyData.length > 0 ? (
            historyData.map((item) => (
              <TableRow key={item.id}>
                {showEmployee && <TableCell>{item.employeeId || "N/A"}</TableCell>}
                {showEmployee && <TableCell>{item.employee || "Current User"}</TableCell>}
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>
                  <span className="text-sm">{item.startDate} to {item.endDate}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item.status === "Approved" || item.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                {showLeaveBalance && (
                  <TableCell>
                    {editingLeave === item.id ? (
                      <Input 
                        type="number" 
                        value={newBalance} 
                        onChange={(e) => setNewBalance(parseInt(e.target.value))}
                        className="w-16 h-8"
                        min="0"
                      />
                    ) : (
                      <span>{item.balance || 0} days</span>
                    )}
                  </TableCell>
                )}
                {showLeaveBalance && onUpdateLeaveBalance && (
                  <TableCell className="text-right">
                    {editingLeave === item.id ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSaveBalance(item.id, item.type)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showLeaveBalance ? (showEmployee ? 8 : 6) : (showEmployee ? 6 : 4)} className="text-center py-6 text-gray-500">
                No leave history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveHistoryTable;
