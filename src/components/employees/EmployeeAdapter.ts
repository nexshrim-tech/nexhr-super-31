
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
    phonenumber: demoData.phone || demoData.phonenumber?.toString() || '', // Convert phone number to string
    jobtitle: demoData.role || demoData.jobtitle || '',
    department: demoData.department || '',
    joiningdate: demoData.joining || demoData.joiningdate || '',
    employmentstatus: demoData.status || demoData.employmentstatus || 'Active',
    gender: demoData.gender || '',
    dateofbirth: demoData.dob || demoData.dateofbirth || '',
    address: demoData.address || '',
    profilepicturepath: demoData.avatar || demoData.profilepicturepath || '',
    monthlysalary: demoData.monthlysalary || 0, // Using monthlysalary consistently
    employmenttype: demoData.employmenttype || '', // Correctly mapping to employmenttype
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
    monthlysalary: employee.monthlysalary || 0, // Using monthlysalary consistently
    employmenttype: employee.employmenttype || '', // Correctly mapping to employmenttype
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
