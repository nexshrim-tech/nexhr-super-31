
export interface Department {
  departmentid: string; // Changed to match database type
  customerid: string;
  departmentname?: string;
  departmentstatus?: string;
  managerid: string;
  numberofemployees?: number;
  annualbudget?: number;
}
