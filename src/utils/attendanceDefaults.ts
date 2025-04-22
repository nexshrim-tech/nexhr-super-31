
import { format } from 'date-fns';

export const markAsAbsent = (employeeId: number, date: string) => {
  return {
    employeeid: employeeId,
    date: date,
    status: 'Absent',
    checkintime: null,
    checkouttime: null,
    workhours: null,
    notes: 'Automatically marked as absent'
  };
};

export const generateDefaultAttendance = (employeeId: number, currentDate: Date) => {
  return markAsAbsent(employeeId, format(currentDate, 'yyyy-MM-dd'));
};
