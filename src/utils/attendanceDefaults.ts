
import { format } from 'date-fns';

export const markAsNotMarked = (employeeId: number, date: string) => {
  return {
    employeeid: employeeId,
    date: date,
    status: 'Not Marked',
    checkintime: null,
    checkouttime: null,
    workhours: null,
    notes: 'Attendance not marked yet',
    location: null,
  };
};

export const markAsAbsent = (employeeId: number, date: string) => {
  return {
    employeeid: employeeId,
    date: date,
    status: 'Absent',
    checkintime: null,
    checkouttime: null,
    workhours: null,
    notes: 'Automatically marked as absent',
    location: null,
  };
};

export const generateDefaultAttendance = (employeeId: number, currentDate: Date) => {
  const now = new Date();
  const cutoffTime = new Date(currentDate);
  cutoffTime.setHours(12, 0, 0, 0);

  // If it's before 12 PM, mark as "Not Marked"
  // If it's after 12 PM, mark as "Absent"
  return now < cutoffTime ? 
    markAsNotMarked(employeeId, format(currentDate, 'yyyy-MM-dd')) :
    markAsAbsent(employeeId, format(currentDate, 'yyyy-MM-dd'));
};
