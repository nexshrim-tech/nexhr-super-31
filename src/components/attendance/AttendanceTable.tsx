
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Edit, Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttendanceForDate, AttendanceRecord, updateAttendanceRecord, setupAttendanceSubscription } from "@/services/attendance/attendanceService";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  const { data: records = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['attendance', formattedDate],
    queryFn: () => getAttendanceForDate(formattedDate)
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<AttendanceRecord>>({});
  const [localRecords, setLocalRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (records) {
      setLocalRecords(records as AttendanceRecord[]);
      console.log("Local records updated from query:", records);
    }
    
    // Set up real-time updates for attendance records
    const channel = setupAttendanceSubscription();
    
    // Listen for database changes
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendance'
      },
      (payload) => {
        console.log('Attendance data changed in table component:', payload);
        
        // When attendance data changes, invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['attendance', formattedDate] });
        
        // Display appropriate toast message based on the event type
        if (payload.eventType === 'INSERT') {
          toast.success("New attendance record added");
        } else if (payload.eventType === 'UPDATE') {
          toast.info("Attendance record updated");
        } else if (payload.eventType === 'DELETE') {
          toast.info("Attendance record removed");
        }
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [records, queryClient, formattedDate]);

  const renderAttendanceStatus = (status: string | null) => {
    if (!status) return null;
    
    let badgeClass = "";
    
    switch (status.toLowerCase()) {
      case "present":
        badgeClass = "bg-green-500 text-white";
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
      case "not marked":
        badgeClass = "bg-gray-100 text-gray-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }
    
    return <Badge className={badgeClass}>{status}</Badge>;
  };

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingId(record.employeeid);
    setEditData({
      employeeid: record.employeeid,
      date: record.date || formattedDate,
      checkintime: record.checkintime || formatTimeForInput(record.checkintimestamp),
      checkouttime: record.checkouttime || formatTimeForInput(record.checkouttimestamp),
      status: record.status || '',
      notes: record.notes || '',
      customerid: record.customerid
    });
  };

  const handleSaveEdit = async (record: AttendanceRecord) => {
    try {
      // Check if this is a new attendance record (for absent employees)
      const isNewRecord = record.status === 'Absent' && !record.checkintimestamp;
      
      const updatedRecord = {
        ...record,
        ...editData
      };
      
      console.log("Saving record with data:", updatedRecord);
      
      // Update record in Supabase
      const savedRecord = await updateAttendanceRecord(
        updatedRecord.employeeid, 
        {
          status: updatedRecord.status,
          checkintime: updatedRecord.checkintime,
          checkouttime: updatedRecord.checkouttime,
          date: updatedRecord.date || formattedDate,
          notes: updatedRecord.notes
        }
      );
      
      if (savedRecord) {
        console.log("Received saved record:", savedRecord);
        
        const recordIndex = localRecords.findIndex(r => r.employeeid === record.employeeid);
        
        if (recordIndex !== -1) {
          const updatedRecords = [...localRecords];
          updatedRecords[recordIndex] = {
            ...record,
            ...savedRecord,
            employee: record.employee,
            status: savedRecord.status || editData.status
          };
          
          console.log("Updating local records with:", updatedRecords[recordIndex]);
          setLocalRecords(updatedRecords);
        }
      }
      
      setEditingId(null);
      setEditData({});
      
      toast.success(isNewRecord ? "Attendance record created" : "Attendance record updated");
      
      // Force refresh data
      queryClient.invalidateQueries({ queryKey: ['attendance', formattedDate] });
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Failed to save attendance record");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatTimeFromDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      return format(date, 'hh:mm a');
    } catch (error) {
      return "-";
    }
  };
  
  const formatTimeForInput = (dateStr: string | null) => {
    try {
      if (!dateStr) return '';
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return '';
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  const filteredRecords = localRecords.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const employeeName = record.employee 
      ? `${record.employee.firstname || ''} ${record.employee.lastname || ''}`.toLowerCase()
      : '';
    
    return (
      employeeName.includes(searchLower) ||
      (record.status?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (isError) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Error Loading Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Failed to load attendance data. Please try again.
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <TableRow key={`emp-${record.employeeid}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={record.selfieimagepath || ""} alt={record.employee ? `${record.employee.firstname} ${record.employee.lastname}` : `Employee ${record.employeeid}`} />
                        <AvatarFallback>
                          {record.employee ? `${record.employee.firstname?.[0] || ''}${record.employee.lastname?.[0] || ''}` : 'EM'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {record.employee ? `${record.employee.firstname} ${record.employee.lastname}` : `Employee ID: ${record.employeeid}`}
                        </div>
                        <div className="text-xs text-gray-500">ID: {record.employeeid}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === record.employeeid ? (
                      <Input
                        type="time"
                        value={editData.checkintime || ''}
                        onChange={(e) => setEditData({...editData, checkintime: e.target.value})}
                        className="w-full"
                      />
                    ) : (
                      record.checkintime || formatTimeFromDate(record.checkintimestamp)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.employeeid ? (
                      <Input
                        type="time"
                        value={editData.checkouttime || ''}
                        onChange={(e) => setEditData({...editData, checkouttime: e.target.value})}
                        className="w-full"
                      />
                    ) : (
                      record.checkouttime || formatTimeFromDate(record.checkouttimestamp)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.employeeid ? (
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
                          <SelectItem value="Work From Home">Work From Home</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      renderAttendanceStatus(record.status)
                    )}
                  </TableCell>
                  <TableCell>{record.workhours ? `${record.workhours}` : '-'}</TableCell>
                  <TableCell className="text-right">
                    {editingId === record.employeeid ? (
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
