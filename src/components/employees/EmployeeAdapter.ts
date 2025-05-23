
import { Employee } from "@/types/employee";

// This adapter function converts demo/UI data format to match the Employee interface
export const adaptEmployeeData = (demoData: any): Employee => {
  return {
    employeeid: demoData.employeeid || demoData.id || '',
    customerid: demoData.customerid || '',
    employeeauthid: demoData.employeeauthid,
    firstname: demoData.name ? demoData.name.split(' ')[0] : demoData.firstname || '',
    lastname: demoData.name ? demoData.name.split(' ')[1] || '' : demoData.lastname || '',
    email: demoData.email || '',
    phonenumber: typeof demoData.phone === 'string' ? parseInt(demoData.phone) : demoData.phonenumber,
    jobtitle: demoData.role || demoData.jobtitle || '',
    department: demoData.department || '',
    joiningdate: demoData.joining || demoData.joiningdate || null,
    employmentstatus: demoData.status || demoData.employmentstatus || 'Active',
    gender: demoData.gender || '',
    dateofbirth: demoData.dob || demoData.dateofbirth || null,
    address: demoData.address || '',
    profilepicturepath: demoData.avatar || demoData.profilepicturepath || '',
    monthlysalary: typeof demoData.monthlysalary === 'string' 
      ? parseFloat(demoData.monthlysalary) 
      : (demoData.monthlysalary || 0),
    employmenttype: demoData.employmenttype || '', 
    city: demoData.city || '',
    state: demoData.state || '',
    country: demoData.country || '',
    postalcode: demoData.postalcode || demoData.zipcode || '',
    bloodgroup: demoData.bloodgroup || '',
    fathersname: demoData.fathersname || demoData.fatherName || '',
    maritalstatus: demoData.maritalstatus || '',
    disabilitystatus: demoData.disabilitystatus || (demoData.hasDisability ? 'Yes' : 'No'),
    nationality: demoData.nationality || '',
    worklocation: demoData.worklocation || '',
    leavebalance: typeof demoData.leavebalance === 'string' 
      ? parseInt(demoData.leavebalance) 
      : (demoData.leavebalance || 0),
    employeepassword: demoData.employeepassword || '',
    documentpath: demoData.documentpath || null
  };
};

// Convert from Employee to UI format (for backward compatibility)
export const adaptToUIFormat = (employee: Employee): any => {
  return {
    id: employee.employeeid,
    name: `${employee.firstname || ''} ${employee.lastname || ''}`.trim(),
    email: employee.email,
    phone: employee.phonenumber?.toString() || '',
    employeeId: employee.employeeid,
    role: employee.jobtitle || '',
    department: employee.department || '',
    dob: employee.dateofbirth || '',
    gender: employee.gender || '',
    address: employee.address || '',
    joining: employee.joiningdate || '',
    status: employee.employmentstatus || 'Active',
    avatar: employee.profilepicturepath || `${(employee.firstname || '')[0] || ''}${(employee.lastname || '')[0] || ''}`,
    monthlysalary: employee.monthlysalary || 0,
    employmenttype: employee.employmenttype || '',
    city: employee.city || '',
    state: employee.state || '',
    country: employee.country || '',
    postalcode: employee.postalcode || '',
    bloodgroup: employee.bloodgroup || '',
    fatherName: employee.fathersname || '',
    maritalstatus: employee.maritalstatus || '',
    hasDisability: employee.disabilitystatus === 'Yes',
    nationality: employee.nationality || '',
    worklocation: employee.worklocation || '',
    leavebalance: employee.leavebalance || 0,
    employeepassword: employee.employeepassword || '',
    documentpath: employee.documentpath || null,
    // Default values for UI compatibility
    tasks: [],
    assets: [],
    leaves: "0/0",
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      bankName: ""
    },
    documents: {
      aadharCard: "",
      panCard: ""
    },
    geofencingEnabled: false
  };
};
