
import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddAttendanceFormData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}

interface AddAttendanceSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newAttendanceData: AddAttendanceFormData;
  setNewAttendanceData: React.Dispatch<React.SetStateAction<AddAttendanceFormData>>;
  handleAddAttendance: () => void;
}

const AddAttendanceSheet = ({
  isOpen,
  onOpenChange,
  newAttendanceData,
  setNewAttendanceData,
  handleAddAttendance,
}: AddAttendanceSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Attendance Record</SheetTitle>
          <SheetDescription>
            Create a new attendance record for an employee
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="employee">Employee</Label>
            <Select 
              value={newAttendanceData.employeeId} 
              onValueChange={(value) => setNewAttendanceData({...newAttendanceData, employeeId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto">
                <SelectItem value="EMP001">Olivia Rhye</SelectItem>
                <SelectItem value="EMP002">Phoenix Baker</SelectItem>
                <SelectItem value="EMP003">Lana Steiner</SelectItem>
                <SelectItem value="EMP004">Demi Wilkinson</SelectItem>
                <SelectItem value="EMP005">Candice Wu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newAttendanceData.date}
              onChange={(e) => setNewAttendanceData({...newAttendanceData, date: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check In</Label>
              <Input
                id="checkIn"
                value={newAttendanceData.checkIn}
                onChange={(e) => setNewAttendanceData({...newAttendanceData, checkIn: e.target.value})}
                placeholder="09:00 AM"
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check Out</Label>
              <Input
                id="checkOut"
                value={newAttendanceData.checkOut}
                onChange={(e) => setNewAttendanceData({...newAttendanceData, checkOut: e.target.value})}
                placeholder="05:00 PM"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={newAttendanceData.status}
              onValueChange={(value) => setNewAttendanceData({...newAttendanceData, status: value})}
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
              value={newAttendanceData.notes}
              onChange={(e) => setNewAttendanceData({...newAttendanceData, notes: e.target.value})}
              placeholder="Add any additional notes here"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddAttendance}>
            Save Record
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddAttendanceSheet;
