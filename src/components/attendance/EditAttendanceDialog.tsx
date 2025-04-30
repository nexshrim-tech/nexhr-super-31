
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceRecord } from "@/services/attendance/attendanceService";

export interface EditFormData {
  date: string;
  checkintime: string;
  checkouttime: string;
  status: string;
  notes: string;
}

interface EditAttendanceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentRecord: AttendanceRecord | null;
  editFormData: EditFormData;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
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
  
  const employeeName = currentRecord.employee 
    ? `${currentRecord.employee.firstname || ''} ${currentRecord.employee.lastname || ''}`
    : `Employee ID: ${currentRecord.employeeid}`;
  
  // Use the appropriate date field
  const recordDate = currentRecord.date || new Date().toISOString().split('T')[0];
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            {employeeName} • {recordDate}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkintime">Check In Time</Label>
              <Input
                id="checkintime"
                type="time"
                value={editFormData.checkintime}
                onChange={(e) => setEditFormData({...editFormData, checkintime: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="checkouttime">Check Out Time</Label>
              <Input
                id="checkouttime"
                type="time"
                value={editFormData.checkouttime}
                onChange={(e) => setEditFormData({...editFormData, checkouttime: e.target.value})}
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
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Half Day">Half Day</SelectItem>
                <SelectItem value="Work From Home">Work From Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
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
