
import { Employee } from "@/types/employee";

// This adapter function converts demo/UI data format to match the Employee interface
export const adaptEmployeeData = (demoData: any): Employee => {
  return {
    employeeid: demoData.employeeid || demoData.id || '',
    customerid: demoData.customerid || '',
    employeeauthid: demoData.employeeauthid,
    firstname: demoData.name ? demoData.name.split(' ')[0] : demoData.firstname || '',
    lastname: demoData.name ? demoData.name.split(' ').slice(1).join(' ') || '' : demoData.lastname || '',
    email: demoData.email || '',
    phonenumber: demoData.phone || demoData.phonenumber || '',
    jobtitle: demoData.role || demoData.jobtitle || '',
    department: demoData.department || '',
    joiningdate: demoData.joining || demoData.joiningdate || null,
    employmentstatus: demoData.status || demoData.employmentstatus || 'Active',
    employmenttype: demoData.employmenttype || 'Full-time',
    gender: demoData.gender || 'Male',
    dateofbirth: demoData.dob || demoData.dateofbirth || null,
    address: demoData.address || '',
    city: demoData.city || '',
    state: demoData.state || '',
    country: demoData.country || '',
    postalcode: demoData.postalcode || demoData.zipcode || '',
    profilepicturepath: demoData.avatar || demoData.profilepicturepath || '',
    monthlysalary: typeof demoData.monthlysalary === 'string' 
      ? parseFloat(demoData.monthlysalary) || 0
      : (demoData.monthlysalary || 0),
    bloodgroup: demoData.bloodgroup || '',
    fathersname: demoData.fathersname || demoData.fatherName || '',
    maritalstatus: demoData.maritalstatus || 'Single',
    disabilitystatus: demoData.disabilitystatus || (demoData.hasDisability ? 'Yes' : 'No Disability'),
    nationality: demoData.nationality || '',
    worklocation: demoData.worklocation || '',
    leavebalance: typeof demoData.leavebalance === 'string' 
      ? parseInt(demoData.leavebalance) || 0
      : (demoData.leavebalance || 0),
    employeepassword: demoData.employeepassword || '',
    documentpath: demoData.documentpath || null
  };
};

// Convert from Employee to UI format (for backward compatibility)
export const adaptToUIFormat = (employee: Employee): any => {
  const fullName = `${employee.firstname || ''} ${employee.lastname || ''}`.trim();
  
  return {
    id: employee.employeeid,
    name: fullName || 'New Employee',
    email: employee.email || '',
    phone: employee.phonenumber || '',
    employeeId: employee.employeeid || '',
    role: employee.jobtitle || '',
    department: employee.department || '',
    dob: employee.dateofbirth || '',
    gender: employee.gender || 'Male',
    address: employee.address || '',
    city: employee.city || '',
    state: employee.state || '',
    country: employee.country || '',
    postalcode: employee.postalcode || '',
    joining: employee.joiningdate || '',
    status: employee.employmentstatus || 'Active',
    employmenttype: employee.employmenttype || 'Full-time',
    avatar: employee.profilepicturepath || `${(employee.firstname || '')[0] || ''}${(employee.lastname || '')[0] || ''}`,
    monthlysalary: employee.monthlysalary || 0,
    bloodgroup: employee.bloodgroup || '',
    fatherName: employee.fathersname || '',
    maritalstatus: employee.maritalstatus || 'Single',
    hasDisability: employee.disabilitystatus === 'Yes',
    disabilitystatus: employee.disabilitystatus || 'No Disability',
    nationality: employee.nationality || '',
    worklocation: employee.worklocation || '',
    leavebalance: employee.leavebalance || 0,
    employeepassword: employee.employeepassword || '',
    documentpath: employee.documentpath || null,
    firstname: employee.firstname || '',
    lastname: employee.lastname || '',
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
