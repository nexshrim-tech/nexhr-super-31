
import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";

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
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
  });

  const isFormValid = newAttendanceData.employeeId && newAttendanceData.date && newAttendanceData.status;

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
            <Label htmlFor="employee">Employee *</Label>
            <Select 
              value={newAttendanceData.employeeId} 
              onValueChange={(value) => setNewAttendanceData({...newAttendanceData, employeeId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.employeeid} value={employee.employeeid}>
                    {employee.firstname} {employee.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={newAttendanceData.date}
              onChange={(e) => setNewAttendanceData({...newAttendanceData, date: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check In Time</Label>
              <Input
                id="checkIn"
                type="time"
                value={newAttendanceData.checkIn}
                onChange={(e) => setNewAttendanceData({...newAttendanceData, checkIn: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check Out Time</Label>
              <Input
                id="checkOut"
                type="time"
                value={newAttendanceData.checkOut}
                onChange={(e) => setNewAttendanceData({...newAttendanceData, checkOut: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={newAttendanceData.status}
              onValueChange={(value) => setNewAttendanceData({...newAttendanceData, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half day">Half Day</SelectItem>
                <SelectItem value="work from home">Work From Home</SelectItem>
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
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddAttendance} disabled={!isFormValid}>
            Save Record
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddAttendanceSheet;
