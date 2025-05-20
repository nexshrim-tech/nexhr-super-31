
// Replace string ID types with number where needed

// Update handleGenerateSalarySlip function to convert string IDs to numbers
const handleGenerateSalarySlip = (employee) => {
  // Convert string ID to number
  const employeeWithNumberId = {
    ...employee,
    id: parseInt(employee.id)
  };
  onGenerateSalarySlip(employeeWithNumberId);
};

// Update handleViewLatestPayslip function similarly
const handleViewLatestPayslip = (employee) => {
  const employeeWithNumberId = {
    ...employee,
    id: parseInt(employee.id)
  };
  onViewLatestPayslip(employeeWithNumberId);
};

// Update handleUpdateSalaryDetails function similarly
const handleUpdateSalaryDetails = (employee) => {
  const employeeWithNumberId = {
    ...employee,
    id: parseInt(employee.id)
  };
  onUpdateSalaryDetails(employeeWithNumberId);
};
