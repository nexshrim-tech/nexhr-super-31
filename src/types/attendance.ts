
export interface AttendanceRecord {
  employeeid: string;
  customerid: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  selfieimagepath?: string;
  status?: string;
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  workhours?: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    jobtitle?: string;
    department?: string;
  };
}

export interface AttendanceSettings {
  attendancesettingid: string;
  customerid: string;
  employee_id: string;
  photoverificationenabled?: boolean;
  geofencingenabled?: boolean;
  workstarttime?: string;
  latethreshold?: string;
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onTimePercentage: number;
}

export interface AttendanceFilters {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  status?: string;
  employee?: string;
}
