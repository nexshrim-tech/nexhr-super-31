
export interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string | number;
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
  terminationdate?: string | null;
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
  disabilitystatus?: string;
}

export interface EmployeeDB {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle?: string;
  department?: string;
  joiningdate?: string | null;
  profilepicturepath?: string;
  customerid?: string | number;
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
  employmenttype?: string | undefined;
  employmenthistory?: string | undefined;
  phonenumber?: number;
  terminationdate?: string | null;
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
}
