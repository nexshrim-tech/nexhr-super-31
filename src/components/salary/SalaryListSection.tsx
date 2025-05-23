
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
  // Update handleGenerateSalarySlip function to convert string IDs to numbers
  const handleGenerateSalarySlip = (employee: EmployeeSalary) => {
    // Convert string ID to number if needed
    const employeeWithNumberId = {
      ...employee,
      id: typeof employee.id === 'string' ? parseInt(employee.id) : employee.id
    };
    onGenerateSalarySlip(employeeWithNumberId);
  };

  // Update handleViewLatestPayslip function similarly
  const handleViewLatestPayslip = (employee: EmployeeSalary) => {
    const employeeWithNumberId = {
      ...employee,
      id: typeof employee.id === 'string' ? parseInt(employee.id) : employee.id
    };
    onViewLatestPayslip(employeeWithNumberId);
  };

  // Update handleUpdateSalaryDetails function similarly
  const handleUpdateSalaryDetails = (employee: EmployeeSalary) => {
    const employeeWithNumberId = {
      ...employee,
      id: typeof employee.id === 'string' ? parseInt(employee.id) : employee.id
    };
    onUpdateSalaryDetails(employeeWithNumberId);
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
