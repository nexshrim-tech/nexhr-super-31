
import React from 'react';
import { FileText, File, Folder } from 'lucide-react';
import { DocumentTemplate, DocumentCategory } from '@/types/documents';

// Common fields that appear in many templates
const commonEmployeeFields = [
  { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
  { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
  { id: 'position', label: 'Position', type: 'text', required: true },
  { id: 'department', label: 'Department', type: 'text', required: true },
];

const dateFields = [
  { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
];

// Document Categories
export const documentCategories: DocumentCategory[] = [
  {
    id: 'employee-management',
    name: 'Employee Management',
    templates: [
      {
        id: 'offer-letter',
        name: 'Offer Letter',
        description: 'Generate an offer letter for new employees',
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        category: 'employee-management',
        fields: [
          ...commonEmployeeFields,
          ...dateFields,
          { id: 'salary', label: 'Salary', type: 'text', required: true },
          { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
        ]
      },
      {
        id: 'appointment-letter',
        name: 'Appointment Letter',
        description: 'Generate an appointment letter',
        icon: <FileText className="h-8 w-8 text-green-500" />,
        category: 'employee-management',
        fields: [
          ...commonEmployeeFields,
          ...dateFields,
          { id: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['3 months', '6 months', '1 year'], required: true },
          { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
        ]
      },
      {
        id: 'joining-letter',
        name: 'Joining Letter',
        description: 'Generate a joining letter for new employees',
        icon: <FileText className="h-8 w-8 text-cyan-500" />,
        category: 'employee-management',
        fields: [
          ...commonEmployeeFields,
          ...dateFields,
          { id: 'reportingManager', label: 'Reporting Manager', type: 'text', required: true },
          { id: 'workingHours', label: 'Working Hours', type: 'text', required: true },
          { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
        ]
      },
      {
        id: 'employee-contract',
        name: 'Employee Agreement/Contract',
        description: 'Generate an employment contract',
        icon: <FileText className="h-8 w-8 text-gray-500" />,
        category: 'employee-management',
        fields: [
          ...commonEmployeeFields,
          ...dateFields,
          { id: 'contractDuration', label: 'Contract Duration', type: 'select', options: ['6 months', '1 year', '2 years', 'Permanent'], required: true },
          { id: 'salary', label: 'Salary', type: 'text', required: true },
          { id: 'benefits', label: 'Benefits', type: 'textarea', required: true },
          { id: 'termsAndConditions', label: 'Terms and Conditions', type: 'textarea', required: true },
        ]
      },
      {
        id: 'nda',
        name: 'Non-Disclosure Agreement (NDA)',
        description: 'Generate an NDA for employees',
        icon: <FileText className="h-8 w-8 text-red-500" />,
        category: 'employee-management',
        fields: [
          ...commonEmployeeFields,
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'confidentialInformation', label: 'Confidential Information', type: 'textarea', required: true },
          { id: 'duration', label: 'Duration of Agreement', type: 'select', options: ['1 year', '2 years', '5 years', 'Indefinite'], required: true },
        ]
      },
      {
        id: 'employee-handbook',
        name: 'Employee Handbook',
        description: 'Generate an employee handbook',
        icon: <File className="h-8 w-8 text-blue-600" />,
        category: 'employee-management',
        fields: [
          { id: 'companyName', label: 'Company Name', type: 'text', required: true },
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'companyPolicies', label: 'Company Policies', type: 'textarea', required: true },
          { id: 'leavePolicy', label: 'Leave Policy', type: 'textarea', required: true },
          { id: 'workingHours', label: 'Working Hours', type: 'textarea', required: true },
          { id: 'codeOfConduct', label: 'Code of Conduct', type: 'textarea', required: true },
        ]
      },
      {
        id: 'code-of-conduct',
        name: 'Code of Conduct Policy',
        description: 'Generate a code of conduct policy',
        icon: <FileText className="h-8 w-8 text-indigo-500" />,
        category: 'employee-management',
        fields: [
          { id: 'companyName', label: 'Company Name', type: 'text', required: true },
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'ethicalStandards', label: 'Ethical Standards', type: 'textarea', required: true },
          { id: 'workplaceGuidelines', label: 'Workplace Guidelines', type: 'textarea', required: true },
          { id: 'disciplinaryActions', label: 'Disciplinary Actions', type: 'textarea', required: true },
        ]
      },
    ]
  },
  {
    id: 'payroll',
    name: 'Payroll & Compensation',
    templates: [
      {
        id: 'salary-structure',
        name: 'Salary Structure Template',
        description: 'Generate a salary structure document',
        icon: <FileText className="h-8 w-8 text-green-600" />,
        category: 'payroll',
        fields: [
          ...commonEmployeeFields,
          { id: 'basicSalary', label: 'Basic Salary', type: 'text', required: true },
          { id: 'hra', label: 'HRA', type: 'text', required: true },
          { id: 'conveyanceAllowance', label: 'Conveyance Allowance', type: 'text', required: true },
          { id: 'medicalAllowance', label: 'Medical Allowance', type: 'text', required: true },
          { id: 'specialAllowance', label: 'Special Allowance', type: 'text', required: true },
          { id: 'providentFund', label: 'Provident Fund', type: 'text', required: true },
        ]
      },
      {
        id: 'salary-slip',
        name: 'Payslip Template',
        description: 'Generate a salary slip for employees',
        icon: <FileText className="h-8 w-8 text-red-500" />,
        category: 'payroll',
        fields: [
          ...commonEmployeeFields,
          { id: 'month', label: 'Month', type: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], required: true },
          { id: 'year', label: 'Year', type: 'text', required: true },
          { id: 'basicSalary', label: 'Basic Salary', type: 'text', required: true },
          { id: 'allowances', label: 'Allowances', type: 'text', required: true },
          { id: 'deductions', label: 'Deductions', type: 'text', required: true },
        ]
      },
      {
        id: 'salary-revision',
        name: 'Salary Revision Letter',
        description: 'Generate a salary revision letter',
        icon: <FileText className="h-8 w-8 text-yellow-500" />,
        category: 'payroll',
        fields: [
          ...commonEmployeeFields,
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'currentSalary', label: 'Current Salary', type: 'text', required: true },
          { id: 'revisedSalary', label: 'Revised Salary', type: 'text', required: true },
          { id: 'revisionReason', label: 'Reason for Revision', type: 'textarea', required: true },
        ]
      },
      {
        id: 'bonus-letter',
        name: 'Bonus and Incentive Letter',
        description: 'Generate a bonus or incentive letter',
        icon: <FileText className="h-8 w-8 text-amber-500" />,
        category: 'payroll',
        fields: [
          ...commonEmployeeFields,
          { id: 'bonusAmount', label: 'Bonus Amount', type: 'text', required: true },
          { id: 'bonusType', label: 'Bonus Type', type: 'select', options: ['Annual Bonus', 'Performance Bonus', 'Festival Bonus', 'Other'], required: true },
          { id: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
          { id: 'bonusReason', label: 'Reason for Bonus', type: 'textarea', required: true },
        ]
      },
      {
        id: 'tax-declaration',
        name: 'Tax Declaration Form',
        description: 'Generate a tax declaration form',
        icon: <FileText className="h-8 w-8 text-blue-700" />,
        category: 'payroll',
        fields: [
          ...commonEmployeeFields,
          { id: 'financialYear', label: 'Financial Year', type: 'text', required: true },
          { id: 'panNumber', label: 'PAN Number', type: 'text', required: true },
          { id: 'investments', label: 'Investment Details', type: 'textarea', required: true },
          { id: 'housingLoan', label: 'Housing Loan Details', type: 'textarea' },
          { id: 'rentDetails', label: 'Rent Details', type: 'textarea' },
        ]
      },
    ]
  },
  {
    id: 'attendance-leave',
    name: 'Attendance & Leave Management',
    templates: [
      {
        id: 'leave-request',
        name: 'Leave Request Form',
        description: 'Generate a leave request form',
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        category: 'attendance-leave',
        fields: [
          ...commonEmployeeFields,
          { id: 'leaveType', label: 'Leave Type', type: 'select', options: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity/Paternity Leave', 'Other'], required: true },
          { id: 'startDate', label: 'Start Date', type: 'date', required: true },
          { id: 'endDate', label: 'End Date', type: 'date', required: true },
          { id: 'reason', label: 'Reason for Leave', type: 'textarea', required: true },
          { id: 'contactDuringLeave', label: 'Contact During Leave', type: 'text', required: true },
        ]
      },
      {
        id: 'leave-approval',
        name: 'Leave Approval/Rejection Letter',
        description: 'Generate a leave approval or rejection letter',
        icon: <FileText className="h-8 w-8 text-purple-500" />,
        category: 'attendance-leave',
        fields: [
          ...commonEmployeeFields,
          { id: 'leaveStatus', label: 'Leave Status', type: 'select', options: ['Approved', 'Rejected', 'Partially Approved'], required: true },
          { id: 'leaveType', label: 'Leave Type', type: 'select', options: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity/Paternity Leave', 'Other'], required: true },
          { id: 'startDate', label: 'Start Date', type: 'date', required: true },
          { id: 'endDate', label: 'End Date', type: 'date', required: true },
          { id: 'remarks', label: 'Remarks/Reason', type: 'textarea', required: true },
        ]
      },
      {
        id: 'timesheet',
        name: 'Timesheet Template',
        description: 'Generate a timesheet for employees',
        icon: <FileText className="h-8 w-8 text-teal-500" />,
        category: 'attendance-leave',
        fields: [
          ...commonEmployeeFields,
          { id: 'weekStartDate', label: 'Week Start Date', type: 'date', required: true },
          { id: 'weekEndDate', label: 'Week End Date', type: 'date', required: true },
          { id: 'mondayHours', label: 'Monday Hours', type: 'text' },
          { id: 'tuesdayHours', label: 'Tuesday Hours', type: 'text' },
          { id: 'wednesdayHours', label: 'Wednesday Hours', type: 'text' },
          { id: 'thursdayHours', label: 'Thursday Hours', type: 'text' },
          { id: 'fridayHours', label: 'Friday Hours', type: 'text' },
          { id: 'saturdayHours', label: 'Saturday Hours', type: 'text' },
          { id: 'sundayHours', label: 'Sunday Hours', type: 'text' },
          { id: 'totalHours', label: 'Total Hours', type: 'text', required: true },
        ]
      },
      {
        id: 'wfh-request',
        name: 'Work From Home Request Form',
        description: 'Generate a work from home request form',
        icon: <FileText className="h-8 w-8 text-rose-500" />,
        category: 'attendance-leave',
        fields: [
          ...commonEmployeeFields,
          { id: 'wfhDate', label: 'WFH Date', type: 'date', required: true },
          { id: 'reason', label: 'Reason for WFH', type: 'textarea', required: true },
          { id: 'workPlan', label: 'Work Plan for the Day', type: 'textarea', required: true },
          { id: 'contactNumber', label: 'Contact Number', type: 'text', required: true },
        ]
      },
    ]
  },
  {
    id: 'performance',
    name: 'Performance & Appraisal',
    templates: [
      {
        id: 'performance-review',
        name: 'Performance Review Form',
        description: 'Generate a performance review form',
        icon: <FileText className="h-8 w-8 text-sky-500" />,
        category: 'performance',
        fields: [
          ...commonEmployeeFields,
          { id: 'reviewPeriod', label: 'Review Period', type: 'text', required: true },
          { id: 'reviewDate', label: 'Review Date', type: 'date', required: true },
          { id: 'jobKnowledge', label: 'Job Knowledge (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'], required: true },
          { id: 'workQuality', label: 'Work Quality (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'], required: true },
          { id: 'attendance', label: 'Attendance (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'], required: true },
          { id: 'communication', label: 'Communication (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'], required: true },
          { id: 'teamwork', label: 'Teamwork (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'], required: true },
          { id: 'strengths', label: 'Strengths', type: 'textarea', required: true },
          { id: 'areasOfImprovement', label: 'Areas of Improvement', type: 'textarea', required: true },
          { id: 'goalsForNextPeriod', label: 'Goals for Next Period', type: 'textarea', required: true },
        ]
      },
      {
        id: 'appraisal-letter',
        name: 'Appraisal Letter',
        description: 'Generate an appraisal letter',
        icon: <FileText className="h-8 w-8 text-emerald-500" />,
        category: 'performance',
        fields: [
          ...commonEmployeeFields,
          { id: 'appraisalDate', label: 'Appraisal Date', type: 'date', required: true },
          { id: 'currentSalary', label: 'Current Salary', type: 'text', required: true },
          { id: 'revisedSalary', label: 'Revised Salary', type: 'text', required: true },
          { id: 'percentageIncrease', label: 'Percentage Increase', type: 'text', required: true },
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'performanceSummary', label: 'Performance Summary', type: 'textarea', required: true },
        ]
      },
      {
        id: 'promotion-letter',
        name: 'Promotion Letter',
        description: 'Generate a promotion letter',
        icon: <FileText className="h-8 w-8 text-lime-500" />,
        category: 'performance',
        fields: [
          ...commonEmployeeFields,
          { id: 'currentPosition', label: 'Current Position', type: 'text', required: true },
          { id: 'newPosition', label: 'New Position', type: 'text', required: true },
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'currentSalary', label: 'Current Salary', type: 'text', required: true },
          { id: 'newSalary', label: 'New Salary', type: 'text', required: true },
          { id: 'reasonForPromotion', label: 'Reason for Promotion', type: 'textarea', required: true },
        ]
      },
      {
        id: 'warning-letter',
        name: 'Warning Letter for Poor Performance',
        description: 'Generate a warning letter for poor performance',
        icon: <FileText className="h-8 w-8 text-red-600" />,
        category: 'performance',
        fields: [
          ...commonEmployeeFields,
          { id: 'warningDate', label: 'Warning Date', type: 'date', required: true },
          { id: 'warningType', label: 'Warning Type', type: 'select', options: ['First Warning', 'Second Warning', 'Final Warning'], required: true },
          { id: 'incidentDate', label: 'Incident Date', type: 'date', required: true },
          { id: 'incidentDescription', label: 'Incident Description', type: 'textarea', required: true },
          { id: 'improvementPlan', label: 'Improvement Plan', type: 'textarea', required: true },
          { id: 'consequencesOfNoImprovement', label: 'Consequences of No Improvement', type: 'textarea', required: true },
        ]
      },
    ]
  },
  {
    id: 'exit',
    name: 'Exit & Termination',
    templates: [
      {
        id: 'resignation-letter',
        name: 'Resignation Letter Template',
        description: 'Generate a resignation letter',
        icon: <FileText className="h-8 w-8 text-gray-600" />,
        category: 'exit',
        fields: [
          ...commonEmployeeFields,
          { id: 'resignationDate', label: 'Resignation Date', type: 'date', required: true },
          { id: 'lastWorkingDay', label: 'Last Working Day', type: 'date', required: true },
          { id: 'reasonForResignation', label: 'Reason for Resignation', type: 'textarea', required: true },
          { id: 'noticePeriod', label: 'Notice Period', type: 'select', options: ['Immediate', '1 week', '2 weeks', '1 month', '3 months'], required: true },
        ]
      },
      {
        id: 'exit-interview',
        name: 'Exit Interview Form',
        description: 'Generate an exit interview form',
        icon: <FileText className="h-8 w-8 text-yellow-600" />,
        category: 'exit',
        fields: [
          ...commonEmployeeFields,
          { id: 'dateOfInterview', label: 'Date of Interview', type: 'date', required: true },
          { id: 'dateOfSeparation', label: 'Date of Separation', type: 'date', required: true },
          { id: 'reasonForLeaving', label: 'Reason for Leaving', type: 'select', options: ['Better Opportunity', 'Compensation', 'Work Environment', 'Personal Reasons', 'Relocation', 'Other'], required: true },
          { id: 'feedbackOnCompany', label: 'Feedback on Company', type: 'textarea', required: true },
          { id: 'feedbackOnManagement', label: 'Feedback on Management', type: 'textarea', required: true },
          { id: 'suggestionForImprovement', label: 'Suggestions for Improvement', type: 'textarea', required: true },
        ]
      },
      {
        id: 'experience-certificate',
        name: 'Experience Letter',
        description: 'Generate an experience certificate for employees',
        icon: <FileText className="h-8 w-8 text-purple-500" />,
        category: 'exit',
        fields: [
          ...commonEmployeeFields,
          ...dateFields,
          { id: 'relievingDate', label: 'Relieving Date', type: 'date', required: true },
          { id: 'achievements', label: 'Key Achievements', type: 'textarea' },
          { id: 'responsibilities', label: 'Responsibilities', type: 'textarea', required: true },
        ]
      },
      {
        id: 'settlement-letter',
        name: 'Full & Final Settlement Letter',
        description: 'Generate a full and final settlement letter',
        icon: <FileText className="h-8 w-8 text-blue-600" />,
        category: 'exit',
        fields: [
          ...commonEmployeeFields,
          { id: 'dateOfJoining', label: 'Date of Joining', type: 'date', required: true },
          { id: 'dateOfResignation', label: 'Date of Resignation', type: 'date', required: true },
          { id: 'lastWorkingDay', label: 'Last Working Day', type: 'date', required: true },
          { id: 'salaryForWorkingDays', label: 'Salary for Working Days', type: 'text', required: true },
          { id: 'leaveEncashment', label: 'Leave Encashment', type: 'text', required: true },
          { id: 'bonusAmount', label: 'Bonus Amount', type: 'text', required: true },
          { id: 'deductions', label: 'Deductions', type: 'text', required: true },
          { id: 'netPayable', label: 'Net Payable Amount', type: 'text', required: true },
        ]
      },
      {
        id: 'relieving-letter',
        name: 'Termination Letter',
        description: 'Generate a relieving letter for employees',
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        category: 'exit',
        fields: [
          ...commonEmployeeFields,
          ...dateFields,
          { id: 'relievingDate', label: 'Relieving Date', type: 'date', required: true },
          { id: 'reason', label: 'Reason for Relieving', type: 'select', options: ['Resignation', 'Termination', 'End of Contract', 'Retirement', 'Other'], required: true },
          { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
        ]
      },
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance & Legal',
    templates: [
      {
        id: 'pf-esi-forms',
        name: 'PF & ESI Declaration Forms',
        description: 'Generate PF and ESI declaration forms',
        icon: <FileText className="h-8 w-8 text-indigo-600" />,
        category: 'compliance',
        fields: [
          ...commonEmployeeFields,
          { id: 'dateOfJoining', label: 'Date of Joining', type: 'date', required: true },
          { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
          { id: 'fatherName', label: 'Father/Spouse Name', type: 'text', required: true },
          { id: 'aadharNumber', label: 'Aadhar Number', type: 'text', required: true },
          { id: 'panNumber', label: 'PAN Number', type: 'text', required: true },
          { id: 'bankAccountNumber', label: 'Bank Account Number', type: 'text', required: true },
          { id: 'bankName', label: 'Bank Name', type: 'text', required: true },
          { id: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
          { id: 'nomineeName', label: 'Nominee Name', type: 'text', required: true },
          { id: 'nomineeRelationship', label: 'Nominee Relationship', type: 'text', required: true },
        ]
      },
      {
        id: 'gratuity-form',
        name: 'Gratuity Nomination Form',
        description: 'Generate a gratuity nomination form',
        icon: <FileText className="h-8 w-8 text-emerald-600" />,
        category: 'compliance',
        fields: [
          ...commonEmployeeFields,
          { id: 'dateOfJoining', label: 'Date of Joining', type: 'date', required: true },
          { id: 'nomineeName', label: 'Nominee Name', type: 'text', required: true },
          { id: 'nomineeRelationship', label: 'Nominee Relationship', type: 'text', required: true },
          { id: 'nomineeAddress', label: 'Nominee Address', type: 'textarea', required: true },
          { id: 'nomineePercentage', label: 'Nominee Percentage', type: 'text', required: true },
          { id: 'alternateNomineeName', label: 'Alternate Nominee Name', type: 'text' },
          { id: 'alternateNomineeRelationship', label: 'Alternate Nominee Relationship', type: 'text' },
          { id: 'alternateNomineePercentage', label: 'Alternate Nominee Percentage', type: 'text' },
        ]
      },
      {
        id: 'company-policies',
        name: 'Company Policies',
        description: 'Generate company policy documents',
        icon: <Folder className="h-8 w-8 text-amber-600" />,
        category: 'compliance',
        fields: [
          { id: 'companyName', label: 'Company Name', type: 'text', required: true },
          { id: 'policyType', label: 'Policy Type', type: 'select', options: ['Leave Policy', 'Work from Home Policy', 'IT Policy', 'Anti-Harassment Policy', 'Travel Policy', 'Other'], required: true },
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'policyScope', label: 'Policy Scope', type: 'textarea', required: true },
          { id: 'policyGuidelines', label: 'Policy Guidelines', type: 'textarea', required: true },
          { id: 'approvalAuthority', label: 'Approval Authority', type: 'text', required: true },
        ]
      },
      {
        id: 'confidentiality-agreement',
        name: 'Confidentiality Agreement',
        description: 'Generate a confidentiality agreement',
        icon: <FileText className="h-8 w-8 text-red-600" />,
        category: 'compliance',
        fields: [
          ...commonEmployeeFields,
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'confidentialInformation', label: 'Definition of Confidential Information', type: 'textarea', required: true },
          { id: 'obligationPeriod', label: 'Obligation Period', type: 'select', options: ['1 year', '2 years', '5 years', '10 years', 'Indefinite'], required: true },
          { id: 'returnOfInformation', label: 'Return of Information Clause', type: 'textarea', required: true },
          { id: 'remediesForBreach', label: 'Remedies for Breach', type: 'textarea', required: true },
        ]
      },
    ]
  },
  {
    id: 'other',
    name: 'Other HR Templates',
    templates: [
      {
        id: 'id-card',
        name: 'Employee ID Card Template',
        description: 'Generate an employee ID card template',
        icon: <FileText className="h-8 w-8 text-cyan-600" />,
        category: 'other',
        fields: [
          ...commonEmployeeFields,
          { id: 'dateOfJoining', label: 'Date of Joining', type: 'date', required: true },
          { id: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
          { id: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: true },
          { id: 'validUntil', label: 'Valid Until', type: 'date', required: true },
          { id: 'photoUrl', label: 'Photo URL', type: 'text' },
        ]
      },
      {
        id: 'internship-certificate',
        name: 'Internship Certificate Template',
        description: 'Generate an internship certificate',
        icon: <FileText className="h-8 w-8 text-yellow-700" />,
        category: 'other',
        fields: [
          { id: 'internName', label: 'Intern Name', type: 'text', required: true },
          { id: 'internCollege', label: 'College/University', type: 'text', required: true },
          { id: 'internDepartment', label: 'Department', type: 'text', required: true },
          { id: 'internPosition', label: 'Internship Position', type: 'text', required: true },
          { id: 'startDate', label: 'Start Date', type: 'date', required: true },
          { id: 'endDate', label: 'End Date', type: 'date', required: true },
          { id: 'projectDetails', label: 'Project Details', type: 'textarea', required: true },
          { id: 'skillsAcquired', label: 'Skills Acquired', type: 'textarea', required: true },
          { id: 'performanceGrade', label: 'Performance Grade', type: 'select', options: ['Excellent', 'Very Good', 'Good', 'Satisfactory'], required: true },
        ]
      },
      {
        id: 'training-certificate',
        name: 'Training Completion Certificate',
        description: 'Generate a training completion certificate',
        icon: <FileText className="h-8 w-8 text-pink-600" />,
        category: 'other',
        fields: [
          ...commonEmployeeFields,
          { id: 'trainingName', label: 'Training Name', type: 'text', required: true },
          { id: 'trainingStartDate', label: 'Training Start Date', type: 'date', required: true },
          { id: 'trainingEndDate', label: 'Training End Date', type: 'date', required: true },
          { id: 'trainingDuration', label: 'Training Duration (Hours)', type: 'text', required: true },
          { id: 'trainingDescription', label: 'Training Description', type: 'textarea', required: true },
          { id: 'skillsAcquired', label: 'Skills Acquired', type: 'textarea', required: true },
        ]
      },
      {
        id: 'referral-form',
        name: 'Employee Referral Form',
        description: 'Generate an employee referral form',
        icon: <FileText className="h-8 w-8 text-violet-600" />,
        category: 'other',
        fields: [
          ...commonEmployeeFields,
          { id: 'referringEmployeeId', label: 'Referring Employee ID', type: 'text', required: true },
          { id: 'referredName', label: 'Referred Person Name', type: 'text', required: true },
          { id: 'referredEmail', label: 'Referred Person Email', type: 'text', required: true },
          { id: 'referredPhone', label: 'Referred Person Phone', type: 'text', required: true },
          { id: 'positionReferred', label: 'Position Referred For', type: 'text', required: true },
          { id: 'relationshipWithReferred', label: 'Relationship with Referred Person', type: 'text', required: true },
          { id: 'reasonForReferral', label: 'Reason for Referral', type: 'textarea', required: true },
        ]
      },
    ]
  }
];

// Flatten all templates for easier access
const documentTemplates: DocumentTemplate[] = documentCategories.flatMap(category => 
  category.templates.map(template => ({
    ...template,
    category: category.id
  }))
);

export default documentTemplates;
