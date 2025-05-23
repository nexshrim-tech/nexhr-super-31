
export interface AttendanceRecord {
  attendanceid?: string;
  employeeid: string;
  customerid: string;
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  status?: string;
  selfieimagepath?: string;
  workhours?: string; // Add this property
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}

export interface AttendanceSettings {
  attendancesettingid: string;
  customerid: string;
  employee_id: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

export interface AttendanceLocationData {
  coordinates: number[];
  radius?: number;
  name?: string;
}

export interface AttendanceFilters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  employeeId: string;
  status: string;
}
