
import { format } from 'date-fns';

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
    // We'll remove the attendanceid so that Supabase can assign it properly when inserting
    // This ensures we don't have records with attendanceid: 0
  };
};

export const generateDefaultAttendance = (employeeId: number, currentDate: Date) => {
  return markAsAbsent(employeeId, format(currentDate, 'yyyy-MM-dd'));
};
