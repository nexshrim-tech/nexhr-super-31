
import React from 'react';
import { FileText } from 'lucide-react';
import { DocumentTemplate } from '@/types/documents';

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'offer-letter',
    name: 'Offer Letter',
    description: 'Generate an offer letter for new employees',
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'salary', label: 'Salary', type: 'text', required: true },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'appointment-letter',
    name: 'Appointment Letter',
    description: 'Generate an appointment letter',
    icon: <FileText className="h-8 w-8 text-green-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['3 months', '6 months', '1 year'], required: true },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'experience-certificate',
    name: 'Experience Certificate',
    description: 'Generate an experience certificate for employees',
    icon: <FileText className="h-8 w-8 text-purple-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'relievingDate', label: 'Relieving Date', type: 'date', required: true },
      { id: 'achievements', label: 'Key Achievements', type: 'textarea' },
    ]
  },
  {
    id: 'relieving-letter',
    name: 'Relieving Letter',
    description: 'Generate a relieving letter for employees',
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'relievingDate', label: 'Relieving Date', type: 'date', required: true },
      { id: 'reason', label: 'Reason for Relieving', type: 'select', options: ['Resignation', 'Termination', 'End of Contract', 'Retirement', 'Other'], required: true },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'salary-slip',
    name: 'Salary Slip',
    description: 'Generate a salary slip for employees',
    icon: <FileText className="h-8 w-8 text-red-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { id: 'month', label: 'Month', type: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], required: true },
      { id: 'year', label: 'Year', type: 'text', required: true },
      { id: 'basicSalary', label: 'Basic Salary', type: 'text', required: true },
      { id: 'allowances', label: 'Allowances', type: 'text', required: true },
      { id: 'deductions', label: 'Deductions', type: 'text', required: true },
    ]
  },
];

export default documentTemplates;
