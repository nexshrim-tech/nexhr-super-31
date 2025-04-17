
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
    phonenumber: demoData.phone || demoData.phonenumber || '',
    jobtitle: demoData.role || demoData.jobtitle || '',
    department: typeof demoData.department === 'string' 
      ? parseInt(demoData.department) || 0 
      : demoData.department || 0,
    joiningdate: demoData.joining || demoData.joiningdate || '',
    employeestatus: demoData.status || demoData.employeestatus || 'Active',
    gender: demoData.gender || '',
    dateofbirth: demoData.dob || demoData.dateofbirth || '',
    address: demoData.address || '',
    profilepicturepath: demoData.avatar || demoData.profilepicturepath || '',
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
    department: employee.department?.toString() || '',
    dob: employee.dateofbirth || '',
    gender: employee.gender || '',
    address: employee.address || '',
    joining: employee.joiningdate || '',
    status: employee.employeestatus || 'Active',
    avatar: employee.profilepicturepath || `${employee.firstname[0]}${employee.lastname[0]}`,
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
