
export interface EmployeeLocation {
  employeeid: string; // Changed from number to string to match data
  latitude: number;
  longitude: number;
  timestamp: string;
  track_id: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}
