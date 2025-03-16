
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Eye } from "lucide-react";

interface LeaveApplication {
  id: number;
  employee: {
    name: string;
    avatar: string;
  };
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
}

interface LeaveTableProps {
  applications: LeaveApplication[];
  onViewLeave: (application: LeaveApplication) => void;
  onApproveLeave: (id: number) => void;
  onRejectLeave: (id: number) => void;
}

const LeaveTable = ({ applications, onViewLeave, onApproveLeave, onRejectLeave }: LeaveTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications && applications.length > 0 ? (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" alt={application.employee.name} />
                      <AvatarFallback>{application.employee.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{application.employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{application.type}</div>
                  <div className="text-xs text-gray-500">
                    {application.startDate} to {application.endDate}
                  </div>
                </TableCell>
                <TableCell>{application.duration}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      application.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : application.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewLeave(application)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {application.status === "Pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => onApproveLeave(application.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => onRejectLeave(application.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                No pending leave requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveTable;
