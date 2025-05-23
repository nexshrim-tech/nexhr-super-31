
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
  employmentstatus: emp.employmentstatus || '',
  employmenttype: emp.employmenttype || '',
  phonenumber: emp.phonenumber ? emp.phonenumber.toString() : '',
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
  if (employee.firstname !== undefined) dbEmployee.firstname = employee.firstname;
  if (employee.lastname !== undefined) dbEmployee.lastname = employee.lastname;
  if (employee.email !== undefined) dbEmployee.email = employee.email;
  if (employee.jobtitle !== undefined) dbEmployee.jobtitle = employee.jobtitle;
  if (employee.department !== undefined) dbEmployee.department = employee.department;
  if (employee.joiningdate !== undefined) dbEmployee.joiningdate = employee.joiningdate;
  if (employee.profilepicturepath !== undefined) dbEmployee.profilepicturepath = employee.profilepicturepath;
  if (employee.customerid !== undefined) dbEmployee.customerid = employee.customerid;
  if (employee.address !== undefined) dbEmployee.address = employee.address;
  if (employee.gender !== undefined) dbEmployee.gender = employee.gender;
  if (employee.dateofbirth !== undefined) dbEmployee.dateofbirth = employee.dateofbirth;
  if (employee.city !== undefined) dbEmployee.city = employee.city;
  if (employee.state !== undefined) dbEmployee.state = employee.state;
  if (employee.country !== undefined) dbEmployee.country = employee.country;
  if (employee.postalcode !== undefined) dbEmployee.zipcode = employee.postalcode; // Map postalcode to zipcode
  if (employee.employmentstatus !== undefined) dbEmployee.employmentstatus = employee.employmentstatus;
  if (employee.employmenttype !== undefined) dbEmployee.employmenttype = employee.employmenttype;
  if (employee.bloodgroup !== undefined) dbEmployee.bloodgroup = employee.bloodgroup;
  if (employee.fathersname !== undefined) dbEmployee.fathersname = employee.fathersname;
  if (employee.maritalstatus !== undefined) dbEmployee.maritalstatus = employee.maritalstatus;
  if (employee.disabilitystatus !== undefined) dbEmployee.disabilitystatus = employee.disabilitystatus;
  if (employee.nationality !== undefined) dbEmployee.nationality = employee.nationality;
  if (employee.worklocation !== undefined) dbEmployee.worklocation = employee.worklocation;
  if (employee.leavebalance !== undefined) dbEmployee.leavebalance = employee.leavebalance;
  if (employee.employeepassword !== undefined) dbEmployee.employeepassword = employee.employeepassword;
  if (employee.documentpath !== undefined) dbEmployee.documentpath = employee.documentpath;
  
  // Handle monthlysalary
  if (employee.monthlysalary !== undefined) {
    dbEmployee.monthlysalary = typeof employee.monthlysalary === 'string' 
      ? parseFloat(employee.monthlysalary) 
      : employee.monthlysalary;
  }
  
  // Handle phonenumber conversion for the database (expects numeric)
  if (employee.phonenumber !== undefined && employee.phonenumber !== null) {
    if (typeof employee.phonenumber === 'string' && employee.phonenumber.trim() !== '') {
      // Remove non-numeric characters before parsing
      const cleanedNumber = employee.phonenumber.replace(/\D/g, '');
      const parsedPhone = cleanedNumber ? parseInt(cleanedNumber, 10) : null;
      dbEmployee.phonenumber = !isNaN(parsedPhone as number) ? parsedPhone : null;
    } else if (typeof employee.phonenumber === 'number') {
      dbEmployee.phonenumber = employee.phonenumber;
    } else {
      dbEmployee.phonenumber = null;
    }
  }

  return dbEmployee;
};
