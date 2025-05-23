
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
    jobtitle?: string;
  };
}
