
export interface Customer {
  customerid: string;
  customerauthid: string;
  name?: string;
  email?: string;
  phonenumber?: string;
  planid?: number;
  companysize?: string;
  // Note: password removed as it's not in the database schema
}
