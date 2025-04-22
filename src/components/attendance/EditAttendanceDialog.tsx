
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceRecord } from "@/services/attendance/attendanceService";

interface EditAttendanceFormData {
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}

interface EditAttendanceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentRecord: AttendanceRecord | null;
  editFormData: EditAttendanceFormData;
  setEditFormData: React.Dispatch<React.SetStateAction<EditAttendanceFormData>>;
  handleSaveEdit: () => void;
}

const EditAttendanceDialog = ({
  isOpen,
  onOpenChange,
  currentRecord,
  editFormData,
  setEditFormData,
  handleSaveEdit,
}: EditAttendanceDialogProps) => {
  if (!currentRecord) return null;
  
  // Get employee name from the record
  const employeeName = currentRecord.employee 
    ? `${currentRecord.employee.firstname} ${currentRecord.employee.lastname}`
    : `Employee ID: ${currentRecord.employeeid}`;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            {employeeName} • {currentRecord?.date}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check In Time</Label>
              <Input
                id="checkIn"
                type="time"
                value={editFormData.checkIn}
                onChange={(e) => setEditFormData({...editFormData, checkIn: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check Out Time</Label>
              <Input
                id="checkOut"
                type="time"
                value={editFormData.checkOut}
                onChange={(e) => setEditFormData({...editFormData, checkOut: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Attendance Status</Label>
            <Select
              value={editFormData.status}
              onValueChange={(value) => setEditFormData({...editFormData, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto">
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Half Day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editFormData.notes}
              onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
              placeholder="Add any additional notes here"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttendanceDialog;
