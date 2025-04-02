
// Define the basic Attendance type
export interface Attendance {
  attendanceid?: number;
  employeeid: number;
  attendancedate?: string;
  status: string;
  notes?: string;
  latitude?: string;
  longitude?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  customerid?: number;
  selfieimagepath?: string;
}

// For creating new attendance records
export type CreateAttendanceDto = Omit<Attendance, 'attendanceid'>;

// For updating existing attendance records
export type UpdateAttendanceDto = Partial<CreateAttendanceDto>;
