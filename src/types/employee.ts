
export interface Employee {
  employeeid: string;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string; // UUID string format
  phonenumber?: string;
  address?: string;
  monthlysalary?: number;
  gender?: string;
  dateofbirth?: string | null;
  city?: string;
  state?: string;
  country?: string;
  postalcode?: string;
  employmentstatus?: 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation';
  employmenttype?: string;
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
  disabilitystatus?: string;
  nationality?: string;
  worklocation?: string;
  leavebalance?: number;
  employeepassword?: string;
  documentpath?: string;
}

export interface EmployeeDB {
  employeeid: string;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string; // UUID string format
  address?: string;
  gender?: string;
  dateofbirth?: string | null;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  monthlysalary?: number;
  disabilitystatus?: string;
  documentpath?: string;
  employmentstatus?: string;
  employmenttype?: string;
  phonenumber?: string; // Changed to string to handle formatting
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
  nationality?: string;
  worklocation?: string;
  leavebalance?: number;
  employeepassword?: string;
}
