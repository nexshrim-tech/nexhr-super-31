
export interface Employee {
  employeeid: string;
  customerid: string; // Required field
  employeeauthid?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string; // String type to match how we use it in the UI
  jobtitle?: string;
  department?: string;
  joiningdate?: string;
  employmentstatus?: string; // Changed from union type to string to match DB
  employmenttype?: string;
  gender?: string;
  dateofbirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalcode?: string; // Maps to zipcode in DB
  profilepicturepath?: string;
  monthlysalary?: number;
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
  disabilitystatus?: string;
  nationality?: string;
  worklocation?: string;
  leavebalance?: number;
  employeepassword?: string;
  documentpath?: any;
}

export interface EmployeeDB {
  employeeid: string;
  customerid: string;
  employeeauthid?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: number; // Number type in DB
  jobtitle?: string;
  department?: string;
  joiningdate?: string;
  employmentstatus?: string;
  employmenttype?: string;
  gender?: string;
  dateofbirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string; // Different name in DB
  profilepicturepath?: string;
  monthlysalary?: number;
  bloodgroup?: string;
  fathersname?: string;
  maritalstatus?: string;
  disabilitystatus?: string;
  nationality?: string;
  worklocation?: string;
  leavebalance?: number;
  employeepassword?: string;
  documentpath?: any;
}
