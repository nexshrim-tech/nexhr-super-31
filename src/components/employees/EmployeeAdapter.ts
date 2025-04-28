
import { Employee } from "@/services/employeeService";

// This adapter function converts the demo data format to match the Employee interface
export const adaptEmployeeData = (demoData: any): Employee => {
  return {
    employeeid: typeof demoData.id === 'string' && demoData.id.startsWith('EMP') 
      ? parseInt(demoData.id.replace('EMP', '')) || 0 
      : demoData.employeeid || 0,
    firstname: demoData.name ? demoData.name.split(' ')[0] : demoData.firstname || '',
    lastname: demoData.name ? demoData.name.split(' ')[1] || '' : demoData.lastname || '',
    email: demoData.email || '',
    phonenumber: demoData.phone || demoData.phonenumber?.toString() || '', 
    jobtitle: demoData.role || demoData.jobtitle || '',
    department: demoData.department || '',
    joiningdate: demoData.joining || demoData.joiningdate || '',
    employmentstatus: demoData.status || demoData.employmentstatus || 'Active',
    gender: demoData.gender || '',
    dateofbirth: demoData.dob || demoData.dateofbirth || '',
    address: demoData.address || '',
    profilepicturepath: demoData.avatar || demoData.profilepicturepath || '',
    monthlysalary: demoData.monthlysalary || 0,
    employmenttype: demoData.employmenttype || '', 
    city: demoData.city || '',
    state: demoData.state || '',
    country: demoData.country || '',
    postalcode: demoData.postalcode || '',
    education: demoData.education || '',
    workauthorization: demoData.workauthorization || '',
    employmenthistory: demoData.employmenthistory || '',
    terminationdate: demoData.terminationdate || null,
    probationenddate: demoData.probationenddate || null,
    bloodgroup: demoData.bloodgroup || '',
    fathersname: demoData.fathersname || '',
    maritalstatus: demoData.maritalstatus || '',
    disabilitystatus: demoData.disabilitystatus || ''
  };
};

// Convert from Employee to UI format
export const adaptToUIFormat = (employee: Employee): any => {
  return {
    id: `EMP${employee.employeeid.toString().padStart(3, '0')}`,
    name: `${employee.firstname} ${employee.lastname}`,
    email: employee.email,
    phone: employee.phonenumber || '',
    employeeId: employee.employeeid.toString(),
    role: employee.jobtitle || '',
    department: employee.department || '',
    dob: employee.dateofbirth || '',
    gender: employee.gender || '',
    address: employee.address || '',
    joining: employee.joiningdate || '',
    status: employee.employmentstatus || 'Active',
    avatar: employee.profilepicturepath || `${employee.firstname[0]}${employee.lastname[0]}`,
    monthlysalary: employee.monthlysalary || 0,
    employmenttype: employee.employmenttype || '',
    city: employee.city || '',
    state: employee.state || '',
    country: employee.country || '',
    postalcode: employee.postalcode || '',
    education: employee.education || '',
    workauthorization: employee.workauthorization || '',
    employmenthistory: employee.employmenthistory || '',
    terminationdate: employee.terminationdate || '',
    probationenddate: employee.probationenddate || '',
    bloodgroup: employee.bloodgroup || '',
    fathersname: employee.fathersname || '',
    maritalstatus: employee.maritalstatus || '',
    disabilitystatus: employee.disabilitystatus || '',
    // Default values for UI that might not be in the database
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
