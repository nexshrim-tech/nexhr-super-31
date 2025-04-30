
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
  
  // Map all fields that exist in the database schema, ensuring they're included even if null
  if ('firstname' in employee) dbEmployee.firstname = employee.firstname || null;
  if ('lastname' in employee) dbEmployee.lastname = employee.lastname || null;
  if ('email' in employee) dbEmployee.email = employee.email || null;
  if ('jobtitle' in employee) dbEmployee.jobtitle = employee.jobtitle || null;
  if ('department' in employee) dbEmployee.department = employee.department || null;
  if ('joiningdate' in employee) dbEmployee.joiningdate = employee.joiningdate || null;
  if ('profilepicturepath' in employee) dbEmployee.profilepicturepath = employee.profilepicturepath || null;
  if ('customerid' in employee) dbEmployee.customerid = employee.customerid || null;
  if ('address' in employee) dbEmployee.address = employee.address || null;
  if ('gender' in employee) dbEmployee.gender = employee.gender || null;
  if ('dateofbirth' in employee) dbEmployee.dateofbirth = employee.dateofbirth || null;
  if ('city' in employee) dbEmployee.city = employee.city || null;
  if ('state' in employee) dbEmployee.state = employee.state || null;
  if ('country' in employee) dbEmployee.country = employee.country || null;
  if ('employmentstatus' in employee) dbEmployee.employmentstatus = employee.employmentstatus || null;
  if ('employmenttype' in employee) dbEmployee.employmenttype = employee.employmenttype || null;
  if ('terminationdate' in employee) dbEmployee.terminationdate = employee.terminationdate || null;
  if ('bloodgroup' in employee) dbEmployee.bloodgroup = employee.bloodgroup || null;
  if ('fathersname' in employee) dbEmployee.fathersname = employee.fathersname || null;
  if ('maritalstatus' in employee) dbEmployee.maritalstatus = employee.maritalstatus || null;
  if ('disabilitystatus' in employee) dbEmployee.disabilitystatus = employee.disabilitystatus || null;
  if ('nationality' in employee) dbEmployee.nationality = employee.nationality || null;
  if ('worklocation' in employee) dbEmployee.worklocation = employee.worklocation || null;
  if ('leavebalance' in employee) dbEmployee.leavebalance = employee.leavebalance || null;
  if ('employeepassword' in employee) dbEmployee.employeepassword = employee.employeepassword || null;
  if ('documentpath' in employee) dbEmployee.documentpath = employee.documentpath || null;
  
  // Handle special cases with different field names or formats
  if ('postalcode' in employee) dbEmployee.zipcode = employee.postalcode || null;
  
  // Handle numeric values
  if ('monthlysalary' in employee) {
    const salary = employee.monthlysalary !== undefined ? employee.monthlysalary : null;
    if (salary !== null) {
      dbEmployee.monthlysalary = typeof salary === 'string' ? parseFloat(salary) : salary;
    } else {
      dbEmployee.monthlysalary = 0; // Default to 0 instead of null for salary
    }
  }
  
  // Handle phonenumber conversion for the database (expects numeric)
  if ('phonenumber' in employee) {
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

  console.log('Mapped employee data for database:', dbEmployee);
  return dbEmployee;
};
