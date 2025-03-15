
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LeaveHistoryItem {
  id: number;
  employeeId?: string;
  employee?: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
}

interface LeaveHistoryTableProps {
  historyData: LeaveHistoryItem[];
  showEmployee?: boolean;
}

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ historyData, showEmployee = false }) => {
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showEmployee ? 6 : 4} className="text-center py-6 text-gray-500">
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
