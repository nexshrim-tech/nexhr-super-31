
import { Employee, EmployeeDB } from "@/types/employee";

export const mapEmployeeDBToEmployee = (emp: EmployeeDB): Employee => ({
  employeeid: emp.employeeid,
  firstname: emp.firstname || '',
  lastname: emp.lastname || '',
  email: emp.email || '',
  jobtitle: emp.jobtitle,
  department: emp.department || '',
  joiningdate: emp.joiningdate,
  profilepicturepath: emp.profilepicturepath,
  customerid: emp.customerid,
  address: emp.address,
  gender: emp.gender,
  dateofbirth: emp.dateofbirth,
  city: emp.city,
  state: emp.state,
  country: emp.country,
  postalcode: emp.zipcode,
  monthlysalary: emp.monthlysalary,
  employmentstatus: emp.employmentstatus as 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation',
  employmenttype: emp.employmenttype,
  phonenumber: emp.phonenumber ? emp.phonenumber.toString() : undefined,
  terminationdate: emp.terminationdate,
  bloodgroup: emp.bloodgroup,
  fathersname: emp.fathersname,
  maritalstatus: emp.maritalstatus,
  disabilitystatus: emp.disabilitystatus
});

export const mapEmployeeToDBFormat = (employee: Partial<Employee>): Record<string, any> => {
  const dbEmployee: Record<string, any> = {};
  
  if ('firstname' in employee) dbEmployee.firstname = employee.firstname || null;
  if ('lastname' in employee) dbEmployee.lastname = employee.lastname || null;
  if ('email' in employee) dbEmployee.email = employee.email || null;
  if ('jobtitle' in employee) dbEmployee.jobtitle = employee.jobtitle || null;
  if ('department' in employee) dbEmployee.department = employee.department || null;
  if ('address' in employee) dbEmployee.address = employee.address || null;
  if ('gender' in employee) dbEmployee.gender = employee.gender || null;
  if ('city' in employee) dbEmployee.city = employee.city || null;
  if ('state' in employee) dbEmployee.state = employee.state || null;
  if ('country' in employee) dbEmployee.country = employee.country || null;
  if ('employmentstatus' in employee) dbEmployee.employmentstatus = employee.employmentstatus || null;
  if ('employmenttype' in employee) dbEmployee.employmenttype = employee.employmenttype || null;
  if ('bloodgroup' in employee) dbEmployee.bloodgroup = employee.bloodgroup || null;
  if ('fathersname' in employee) dbEmployee.fathersname = employee.fathersname || null;
  if ('maritalstatus' in employee) dbEmployee.maritalstatus = employee.maritalstatus || null;
  if ('disabilitystatus' in employee) dbEmployee.disabilitystatus = employee.disabilitystatus || null;
  if ('profilepicturepath' in employee) dbEmployee.profilepicturepath = employee.profilepicturepath || null;
  
  if ('joiningdate' in employee) dbEmployee.joiningdate = employee.joiningdate === '' ? null : employee.joiningdate;
  if ('dateofbirth' in employee) dbEmployee.dateofbirth = employee.dateofbirth === '' ? null : employee.dateofbirth;
  if ('terminationdate' in employee) dbEmployee.terminationdate = employee.terminationdate === '' ? null : employee.terminationdate;
  
  if ('postalcode' in employee) {
    dbEmployee.zipcode = employee.postalcode || null;
  }
  
  if ('monthlysalary' in employee) {
    dbEmployee.monthlysalary = employee.monthlysalary !== undefined ? 
      (typeof employee.monthlysalary === 'string' ? parseFloat(employee.monthlysalary) : employee.monthlysalary) : null;
  }
  
  if ('phonenumber' in employee) {
    if (employee.phonenumber) {
      if (typeof employee.phonenumber === 'string' && employee.phonenumber.trim() !== '') {
        const parsedPhone = parseInt(employee.phonenumber, 10);
        dbEmployee.phonenumber = !isNaN(parsedPhone) ? parsedPhone : null;
      } else if (typeof employee.phonenumber === 'number') {
        dbEmployee.phonenumber = employee.phonenumber;
      } else {
        dbEmployee.phonenumber = null;
      }
    } else {
      dbEmployee.phonenumber = null;
    }
  }

  return dbEmployee;
};
