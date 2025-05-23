
// Database types that exactly match the Supabase schema
export interface DatabaseEmployee {
  employeeid: string;
  customerid: string;
  employeeauthid?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: number;
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
  zipcode?: string;
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

export interface DatabaseTrack {
  track_id: string;
  employeeid: string;
  customerid: string;
  coordinates?: number[];
  timestamp?: string;
}

export interface DatabaseExpense {
  expenseid: string;
  employeeid?: string;
  customer_id?: string;
  customerid?: number;
  description?: string;
  category?: string;
  amount?: number;
  submissiondate?: string;
  status?: string;
  billpath?: string;
}

export interface DatabaseTask {
  tasklistid: string;
  employeeid: string;
  customerid: string;
  assignedto: string;
  tasktitle?: string;
  description?: string;
  deadline?: string;
  priority?: string;
  status?: string;
  comments?: string;
  resources?: string;
}

export interface DatabaseAsset {
  asset_id: string;
  employee_id: string;
  customer_id: string;
  assetname?: string;
  assettype?: string;
  serialnumber?: string;
  purchasedate?: string;
  assetvalue?: number;
  assetstatus?: string;
  billpath?: string;
}

export interface DatabasePayslip {
  payslip_id: string;
  employeeid: string;
  customerid: string;
  amount?: number;
  payslipdate?: string;
  generatedtimestamp?: string;
}
