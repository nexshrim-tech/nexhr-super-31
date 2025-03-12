
export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  joiningDate: string;
  manager: string;
  address: string;
  phoneNumber: string;
}

export interface TemplateData {
  id: number;
  name: string;
  content: string;
}

export const generateOfferLetter = (employee: EmployeeData, additionalData: any = {}) => {
  const { name, position, department, salary, joiningDate, manager } = employee;
  const { offerExpiryDate = "14 days from today", startDate = joiningDate } = additionalData;
  
  return `
    [Company Letterhead]
    
    Date: ${new Date().toLocaleDateString()}
    
    Dear ${name},
    
    Subject: Offer of Employment - ${position}
    
    We are pleased to offer you the position of ${position} in the ${department} department at [Company Name]. This letter outlines the terms and conditions of your employment.
    
    Position: ${position}
    Department: ${department}
    Reporting To: ${manager}
    Start Date: ${startDate}
    Salary: $${salary.toLocaleString()} per annum
    
    This offer is valid for ${offerExpiryDate}.
    
    We look forward to welcoming you to our team.
    
    Sincerely,
    
    [HR Manager Name]
    HR Manager
    [Company Name]
  `;
};

export const generateTerminationLetter = (employee: EmployeeData, additionalData: any = {}) => {
  const { name, position, department } = employee;
  const { terminationDate = new Date().toLocaleDateString(), lastWorkingDay = "", reason = "company restructuring" } = additionalData;
  
  return `
    [Company Letterhead]
    
    Date: ${new Date().toLocaleDateString()}
    
    Dear ${name},
    
    Subject: Notice of Termination of Employment
    
    We regret to inform you that your employment with [Company Name] as ${position} in the ${department} department will be terminated effective ${terminationDate} due to ${reason}.
    
    Your last working day will be ${lastWorkingDay || terminationDate}.
    
    [Additional details about final paycheck, benefits, returning company property, etc.]
    
    We appreciate your contributions during your time with us and wish you success in your future endeavors.
    
    Sincerely,
    
    [HR Manager Name]
    HR Manager
    [Company Name]
  `;
};

export const generateSalarySlip = (employee: EmployeeData, additionalData: any = {}) => {
  const { name, id, position, department, salary } = employee;
  const { 
    month = new Date().toLocaleString('default', { month: 'long' }), 
    year = new Date().getFullYear(),
    basicSalary = salary * 0.6,
    hra = salary * 0.3,
    conveyanceAllowance = salary * 0.05,
    medicalAllowance = salary * 0.05,
    incomeTax = salary * 0.1,
    providentFund = salary * 0.05,
    professionalTax = 200,
    loanDeduction = 0
  } = additionalData;
  
  const totalEarnings = basicSalary + hra + conveyanceAllowance + medicalAllowance;
  const totalDeductions = incomeTax + providentFund + professionalTax + loanDeduction;
  const netSalary = totalEarnings - totalDeductions;
  
  return `
    [Company Letterhead]
    
    SALARY SLIP
    
    Month: ${month} ${year}
    
    Employee Details:
    Name: ${name}
    Employee ID: ${id}
    Designation: ${position}
    Department: ${department}
    
    Earnings:
    Basic Salary: $${basicSalary.toFixed(2)}
    HRA: $${hra.toFixed(2)}
    Conveyance Allowance: $${conveyanceAllowance.toFixed(2)}
    Medical Allowance: $${medicalAllowance.toFixed(2)}
    Total Earnings: $${totalEarnings.toFixed(2)}
    
    Deductions:
    Income Tax: $${incomeTax.toFixed(2)}
    Provident Fund: $${providentFund.toFixed(2)}
    Professional Tax: $${professionalTax.toFixed(2)}
    Loan Deduction: $${loanDeduction.toFixed(2)}
    Total Deductions: $${totalDeductions.toFixed(2)}
    
    Net Salary: $${netSalary.toFixed(2)}
    
    This is a computer-generated salary slip and does not require a signature.
  `;
};

// Function to generate HTML from a document template
export const generateDocumentHtml = (template: string, data: any) => {
  let htmlContent = template;
  
  // Replace placeholders with actual data
  Object.keys(data).forEach(key => {
    const placeholder = `{{${key}}}`;
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), data[key]);
  });
  
  return htmlContent;
};

// Function to export to PDF (This would require a PDF library in a real implementation)
export const exportToPdf = (html: string, filename: string) => {
  console.log(`Exporting to PDF: ${filename}`);
  console.log(html);
  
  // In a real implementation, you would use a library like jsPDF or html2pdf
  // Example: html2pdf().from(html).save(filename);
  
  return true;
};
