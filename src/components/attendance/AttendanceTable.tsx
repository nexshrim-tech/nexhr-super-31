
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Edit, Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAttendanceForDate, AttendanceRecord } from "@/services/attendance/attendanceService";

interface AttendanceTableProps {
  selectedDate: Date;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleEditRecord: (record: AttendanceRecord) => void;
}

const AttendanceTable = ({
  selectedDate,
  searchTerm,
  setSearchTerm,
  handleEditRecord,
}: AttendanceTableProps) => {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['attendance', formattedDate],
    queryFn: () => getAttendanceForDate(formattedDate)
  });

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const employeeName = record.employee 
      ? `${record.employee.firstname || ''} ${record.employee.lastname || ''}`.toLowerCase()
      : '';
    
    return (
      employeeName.includes(searchLower) ||
      (record.status?.toLowerCase() || '').includes(searchLower)
    );
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<AttendanceRecord>>({});

  const renderAttendanceStatus = (status: string | null) => {
    if (!status) return null;
    
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

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingId(record.attendanceid);
    setEditData({
      checkintime: record.checkintime,
      checkouttime: record.checkouttime,
      status: record.status,
      notes: record.notes
    });
  };

  const handleSaveEdit = (record: AttendanceRecord) => {
    const updatedRecord = {
      ...record,
      ...editData
    };
    handleEditRecord(updatedRecord);
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatTimeFromDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return "-";
    }
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <TableRow key={record.attendanceid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={record.employee ? `${record.employee.firstname} ${record.employee.lastname}` : `Employee ${record.employeeid}`} />
                        <AvatarFallback>
                          {record.employee ? `${record.employee.firstname?.[0] || ''}${record.employee.lastname?.[0] || ''}` : 'EM'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {record.employee ? `${record.employee.firstname} ${record.employee.lastname}` : `Employee ID: ${record.employeeid}`}
                        </div>
                        <div className="text-xs text-gray-500">{record.employeeid}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === record.attendanceid ? (
                      <Input
                        type="time"
                        value={editData.checkintime || ''}
                        onChange={(e) => setEditData({...editData, checkintime: e.target.value})}
                        className="w-full"
                      />
                    ) : (
                      formatTimeFromDate(record.checkintime)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.attendanceid ? (
                      <Input
                        type="time"
                        value={editData.checkouttime || ''}
                        onChange={(e) => setEditData({...editData, checkouttime: e.target.value})}
                        className="w-full"
                      />
                    ) : (
                      formatTimeFromDate(record.checkouttime)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.attendanceid ? (
                      <Select
                        value={editData.status || ''}
                        onValueChange={(value) => setEditData({...editData, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Half Day">Half Day</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      renderAttendanceStatus(record.status)
                    )}
                  </TableCell>
                  <TableCell>{record.workhours ? `${record.workhours}h` : '-'}</TableCell>
                  <TableCell className="text-right">
                    {editingId === record.attendanceid ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCancelEdit()}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleSaveEdit(record)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(record)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
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
