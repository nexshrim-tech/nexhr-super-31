
import { useState, useEffect } from 'react';
import { Employee } from "@/services/employeeService";
import { useAuth } from '@/context/AuthContext';

export const useEmployeeFormData = () => {
  const { customerId, customerAuthId, isLoading } = useAuth();
  
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({
    employmentstatus: 'Active',
    employmenttype: 'Full-time',
    gender: 'Male',
    maritalstatus: 'Single',
    disabilitystatus: 'No Disability',
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    jobtitle: '',
    department: '',
    dateofbirth: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalcode: '',
    bloodgroup: '',
    fathersname: '',
    nationality: '',
    worklocation: '',
    monthlysalary: 0,
    leavebalance: 0,
    employeeid: ''
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
  });

  useEffect(() => {
    if (!isLoading && (customerId || customerAuthId)) {
      const organizationId = customerId || customerAuthId;
      console.log('Initializing employee with customer data:', {
        customerId,
        customerAuthId,
        organizationId
      });
      
      setEmployeeData(prev => ({
        ...prev,
        customerid: organizationId,
        employeeauthid: prev.employeeauthid || customerAuthId
      }));
    }
  }, [isLoading, customerId, customerAuthId]);

  const handleInputChange = (field: keyof Employee, value: any) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    const fieldMappings: { [key: string]: keyof Employee } = {
      'department': 'department',
      'employmentstatus': 'employmentstatus',
      'employmenttype': 'employmenttype',
      'gender': 'gender',
      'bloodgroup': 'bloodgroup',
      'bloodGroup': 'bloodgroup',
      'maritalstatus': 'maritalstatus',
      'nationality': 'nationality'
    };

    const mappedField = fieldMappings[field];
    if (mappedField) {
      handleInputChange(mappedField, value);
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    if (field === 'hasDisability') {
      handleInputChange('disabilitystatus', checked ? 'Yes' : 'No Disability');
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const fieldMappings: { [key: string]: keyof Employee } = {
      'name': 'firstname',
      'firstname': 'firstname',
      'lastname': 'lastname',
      'email': 'email',
      'phone': 'phonenumber',
      'role': 'jobtitle',
      'jobtitle': 'jobtitle',
      'department': 'department',
      'joining': 'joiningdate',
      'joiningdate': 'joiningdate',
      'dob': 'dateofbirth',
      'dateofbirth': 'dateofbirth',
      'fatherName': 'fathersname',
      'fathersname': 'fathersname',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'country': 'country',
      'postalcode': 'postalcode',
      'nationality': 'nationality',
      'worklocation': 'worklocation',
      'monthlysalary': 'monthlysalary',
      'leavebalance': 'leavebalance'
    };

    if (name === 'name') {
      const nameParts = value.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setEmployeeData(prev => ({
        ...prev,
        firstname: firstName,
        lastname: lastName
      }));
      return;
    }

    const mappedField = fieldMappings[name];
    if (mappedField) {
      if (mappedField === 'monthlysalary' || mappedField === 'leavebalance') {
        const numericValue = parseFloat(value) || 0;
        handleInputChange(mappedField, numericValue);
      } else {
        handleInputChange(mappedField, value);
      }
    }
  };

  const handleEmployeeIdChange = (newEmployeeId: string) => {
    setEmployeeData(prev => ({
      ...prev,
      employeeid: newEmployeeId
    }));
  };

  const handleProfilePhotoUpload = (photoUrl: string) => {
    handleInputChange('profilepicturepath', photoUrl);
  };

  const handleDocumentsChange = (documents: Record<string, string>) => {
    handleInputChange('documentpath', documents);
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getUIEmployeeData = () => ({
    id: '',
    name: `${employeeData.firstname || ''} ${employeeData.lastname || ''}`.trim() || 'New Employee',
    email: employeeData.email || '',
    phone: employeeData.phonenumber || '',
    employeeId: employeeData.employeeid || '',
    role: employeeData.jobtitle || '',
    department: employeeData.department || '',
    dob: employeeData.dateofbirth || '',
    gender: employeeData.gender || 'Male',
    address: employeeData.address || '',
    city: employeeData.city || '',
    state: employeeData.state || '',
    country: employeeData.country || '',
    postalcode: employeeData.postalcode || '',
    joining: employeeData.joiningdate || '',
    status: employeeData.employmentstatus || 'Active',
    employmenttype: employeeData.employmenttype || 'Full-time',
    avatar: employeeData.profilepicturepath || `${(employeeData.firstname || '')[0] || ''}${(employeeData.lastname || '')[0] || ''}`,
    monthlysalary: employeeData.monthlysalary || 0,
    bloodgroup: employeeData.bloodgroup || '',
    bloodGroup: employeeData.bloodgroup || '',
    fatherName: employeeData.fathersname || '',
    maritalstatus: employeeData.maritalstatus || 'Single',
    hasDisability: employeeData.disabilitystatus === 'Yes',
    disabilitystatus: employeeData.disabilitystatus || 'No Disability',
    nationality: employeeData.nationality || '',
    worklocation: employeeData.worklocation || '',
    leavebalance: employeeData.leavebalance || 0,
    firstname: employeeData.firstname || '',
    lastname: employeeData.lastname || '',
    tasks: [],
    assets: [],
    leaves: "0/0",
    bankDetails: bankDetails,
    documents: {
      aadharCard: "",
      panCard: ""
    },
    geofencingEnabled: false
  });

  return {
    employeeData,
    bankDetails,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleFormInputChange,
    handleEmployeeIdChange,
    handleProfilePhotoUpload,
    handleDocumentsChange,
    handleBankDetailsChange,
    getUIEmployeeData,
  };
};
