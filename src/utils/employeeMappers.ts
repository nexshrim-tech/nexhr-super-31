
import { Employee, EmployeeDB } from "@/types/employee";

export const mapEmployeeDBToEmployee = (emp: EmployeeDB): Employee => ({
  employeeid: emp.employeeid,
  firstname: emp.firstname || '',
  lastname: emp.lastname || '',
  email: emp.email || '',
  jobtitle: emp.jobtitle || '',
  department: emp.department || '',
  joiningdate: emp.joiningdate || null,
  profilepicturepath: emp.profilepicturepath || '',
  customerid: emp.customerid, // Already handles UUID as string
  address: emp.address || '',
  gender: emp.gender || '',
  dateofbirth: emp.dateofbirth || null,
  city: emp.city || '',
  state: emp.state || '',
  country: emp.country || '',
  postalcode: emp.zipcode || '',
  monthlysalary: emp.monthlysalary || 0,
  employmentstatus: emp.employmentstatus as 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation' || 'Active',
  employmenttype: emp.employmenttype || '',
  phonenumber: emp.phonenumber || '',
  bloodgroup: emp.bloodgroup || '',
  fathersname: emp.fathersname || '',
  maritalstatus: emp.maritalstatus || '',
  disabilitystatus: emp.disabilitystatus || '',
  nationality: emp.nationality || '',
  worklocation: emp.worklocation || '',
  leavebalance: emp.leavebalance || 0,
  employeepassword: emp.employeepassword || '',
  documentpath: emp.documentpath || ''
});

export const mapEmployeeToDBFormat = (employee: Partial<Employee>): Record<string, any> => {
  const dbEmployee: Record<string, any> = {};
  
  // Map all fields explicitly with appropriate default values
  // This ensures all fields are included in the database operation
  dbEmployee.firstname = employee.firstname || '';
  dbEmployee.lastname = employee.lastname || '';
  dbEmployee.email = employee.email || '';
  dbEmployee.jobtitle = employee.jobtitle || '';
  dbEmployee.department = employee.department || '';
  dbEmployee.joiningdate = employee.joiningdate || null;
  dbEmployee.profilepicturepath = employee.profilepicturepath || '';
  dbEmployee.customerid = employee.customerid || null; // Handles UUID as string
  dbEmployee.address = employee.address || '';
  dbEmployee.gender = employee.gender || '';
  dbEmployee.dateofbirth = employee.dateofbirth || null;
  dbEmployee.city = employee.city || '';
  dbEmployee.state = employee.state || '';
  dbEmployee.country = employee.country || '';
  dbEmployee.zipcode = employee.postalcode || '';
  dbEmployee.employmentstatus = employee.employmentstatus || 'Active';
  dbEmployee.employmenttype = employee.employmenttype || '';
  dbEmployee.bloodgroup = employee.bloodgroup || '';
  dbEmployee.fathersname = employee.fathersname || '';
  dbEmployee.maritalstatus = employee.maritalstatus || '';
  dbEmployee.disabilitystatus = employee.disabilitystatus || '';
  dbEmployee.nationality = employee.nationality || '';
  dbEmployee.worklocation = employee.worklocation || '';
  dbEmployee.leavebalance = employee.leavebalance !== undefined ? employee.leavebalance : 0;
  dbEmployee.employeepassword = employee.employeepassword || '';
  dbEmployee.documentpath = employee.documentpath || '';
  
  // Handle numeric values explicitly
  if (employee.monthlysalary !== undefined) {
    dbEmployee.monthlysalary = typeof employee.monthlysalary === 'string' 
      ? parseFloat(employee.monthlysalary) 
      : employee.monthlysalary;
  } else {
    dbEmployee.monthlysalary = 0; // Default to 0
  }
  
  // Handle phonenumber as string in database
  dbEmployee.phonenumber = employee.phonenumber || '';

  return dbEmployee;
};
