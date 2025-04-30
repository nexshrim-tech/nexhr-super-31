
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
  customerid: emp.customerid,
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
  phonenumber: emp.phonenumber ? emp.phonenumber.toString() : '',
  terminationdate: emp.terminationdate || null,
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
  
  // Handle all fields explicitly, using empty strings or appropriate default values instead of null
  // This ensures the fields are included in the database operation
  dbEmployee.firstname = employee.firstname || '';
  dbEmployee.lastname = employee.lastname || '';
  dbEmployee.email = employee.email || '';
  dbEmployee.jobtitle = employee.jobtitle || '';
  dbEmployee.department = employee.department || '';
  dbEmployee.joiningdate = employee.joiningdate || null;
  dbEmployee.profilepicturepath = employee.profilepicturepath || '';
  dbEmployee.customerid = employee.customerid || null;
  dbEmployee.address = employee.address || '';
  dbEmployee.gender = employee.gender || '';
  dbEmployee.dateofbirth = employee.dateofbirth || null;
  dbEmployee.city = employee.city || '';
  dbEmployee.state = employee.state || '';
  dbEmployee.country = employee.country || '';
  dbEmployee.zipcode = employee.postalcode || '';
  dbEmployee.employmentstatus = employee.employmentstatus || 'Active';
  dbEmployee.employmenttype = employee.employmenttype || '';
  dbEmployee.terminationdate = employee.terminationdate || null;
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
  
  // Handle phonenumber conversion for the database (expects numeric)
  if (employee.phonenumber !== undefined) {
    if (typeof employee.phonenumber === 'string' && employee.phonenumber.trim() !== '') {
      // Remove non-numeric characters before parsing
      const cleanedNumber = employee.phonenumber.replace(/\D/g, '');
      const parsedPhone = cleanedNumber ? parseInt(cleanedNumber, 10) : null;
      dbEmployee.phonenumber = !isNaN(parsedPhone) ? parsedPhone : null;
    } else if (typeof employee.phonenumber === 'number') {
      dbEmployee.phonenumber = employee.phonenumber;
    } else {
      dbEmployee.phonenumber = null;
    }
  }

  console.log('Final employee data for database operation:', dbEmployee);
  return dbEmployee;
};
