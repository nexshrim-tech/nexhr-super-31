
import { Employee } from "@/services/employeeService";

// This adapter function converts the demo data format to match the Employee interface
export const adaptEmployeeData = (demoData: any): Employee => {
  return {
    employeeid: parseInt(demoData.id.replace('EMP', '')) || 0,
    firstname: demoData.name?.split(' ')[0] || '',
    lastname: demoData.name?.split(' ')[1] || '',
    email: demoData.email || '',
    phonenumber: demoData.phone || '',
    jobtitle: demoData.role || '',
    department: typeof demoData.department === 'string' ? 0 : demoData.department,
    joiningdate: demoData.joining || '',
    employeestatus: demoData.status || 'Active',
    gender: demoData.gender || '',
    dateofbirth: demoData.dob || '',
    address: demoData.address || '',
    profilepicturepath: demoData.avatar || '',
    // Map other fields as needed
  };
};
