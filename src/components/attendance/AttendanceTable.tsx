
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AttendanceRecord {
  id: number;
  employeeId: string;
  employee: { name: string; avatar: string };
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  workHours: string;
  notes: string;
}

interface AttendanceTableProps {
  selectedDate: Date;
  searchTerm: string;
  filteredRecords: AttendanceRecord[];
  setSearchTerm: (term: string) => void;
  handleEditRecord: (record: AttendanceRecord) => void;
}

const AttendanceTable = ({
  selectedDate,
  searchTerm,
  filteredRecords,
  setSearchTerm,
  handleEditRecord,
}: AttendanceTableProps) => {
  const renderAttendanceStatus = (status: string) => {
    let badgeClass = "";
    
    switch (status.toLowerCase()) {
      case "present":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "absent":
        badgeClass = "bg-red-100 text-red-800";
        break;
      case "late":
        badgeClass = "bg-yellow-100 text-yellow-800";
        break;
      case "half day":
        badgeClass = "bg-purple-100 text-purple-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }
    
    return <Badge className={badgeClass}>{status}</Badge>;
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Attendance for {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={record.employee.name} />
                        <AvatarFallback>{record.employee.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.employee.name}</div>
                        <div className="text-xs text-gray-500">{record.employeeId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.checkIn || "-"}</TableCell>
                  <TableCell>{record.checkOut || "-"}</TableCell>
                  <TableCell>{renderAttendanceStatus(record.status)}</TableCell>
                  <TableCell>{record.workHours}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditRecord(record)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No attendance records found for selected date
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
