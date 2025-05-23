
import React from 'react';
import { EmployeeSalary } from '@/types/salary';

interface SalaryListSectionProps {
  employees: EmployeeSalary[];
  onGenerateSalarySlip: (employee: EmployeeSalary) => void;
  onViewLatestPayslip: (employee: EmployeeSalary) => void;
  onUpdateSalaryDetails: (employee: EmployeeSalary) => void;
}

const SalaryListSection: React.FC<SalaryListSectionProps> = ({
  employees,
  onGenerateSalarySlip,
  onViewLatestPayslip,
  onUpdateSalaryDetails
}) => {
  // Convert employee ID to string if needed to match EmployeeSalary type
  const handleGenerateSalarySlip = (employee: EmployeeSalary) => {
    const employeeWithStringId = {
      ...employee,
      id: String(employee.id)
    };
    onGenerateSalarySlip(employeeWithStringId);
  };

  const handleViewLatestPayslip = (employee: EmployeeSalary) => {
    const employeeWithStringId = {
      ...employee,
      id: String(employee.id)
    };
    onViewLatestPayslip(employeeWithStringId);
  };

  const handleUpdateSalaryDetails = (employee: EmployeeSalary) => {
    const employeeWithStringId = {
      ...employee,
      id: String(employee.id)
    };
    onUpdateSalaryDetails(employeeWithStringId);
  };

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee.id} className="p-4 border rounded-lg">
          <h3 className="font-medium">{employee.employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.position}</p>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={() => handleGenerateSalarySlip(employee)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Generate Salary Slip
            </button>
            <button 
              onClick={() => handleViewLatestPayslip(employee)}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              View Latest Payslip
            </button>
            <button 
              onClick={() => handleUpdateSalaryDetails(employee)}
              className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
            >
              Update Salary Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaryListSection;
