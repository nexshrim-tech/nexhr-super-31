
import { supabase } from "@/integrations/supabase/client";
import { SalaryAllowances, SalaryDeductions, EmployeeSalary } from "@/types/salary";

// Fetch all salary information for a customer
export const fetchSalaries = async (customerId: number) => {
  try {
    const { data: salaryData, error: salaryError } = await supabase
      .from('salary')
      .select(`
        salaryid,
        basicsalary,
        hra,
        conveyanceallowance,
        medicalallowance,
        specialallowance,
        otherallowance,
        incometax,
        pf,
        professionaltax,
        loandeduction,
        otherdeduction,
        esiemployee,
        employee:employeeid (
          employeeid,
          firstname,
          lastname,
          jobtitle,
          department
        )
      `)
      .eq('customerid', customerId);

    if (salaryError) throw salaryError;

    // Get department data
    const { data: departmentData, error: departmentError } = await supabase
      .from('department')
      .select('departmentid, departmentname');

    if (departmentError) throw departmentError;

    // Create a map for departments
    const departmentMap = new Map();
    departmentData?.forEach(dept => {
      departmentMap.set(dept.departmentid, dept.departmentname);
    });

    // Map to frontend model
    const mappedSalaries: EmployeeSalary[] = (salaryData || []).map(salary => {
      return {
        id: salary.salaryid,
        employee: { 
          name: `${salary.employee.firstname} ${salary.employee.lastname}`,
          avatar: `${salary.employee.firstname.charAt(0)}${salary.employee.lastname.charAt(0)}`
        },
        position: salary.employee.jobtitle || 'Employee',
        department: departmentMap.get(salary.employee.department) || 'General',
        salary: salary.basicsalary + salary.hra + salary.conveyanceallowance + 
                salary.medicalallowance + salary.specialallowance + salary.otherallowance,
        lastIncrement: new Date().toISOString().split('T')[0], // Placeholder, can be calculated in future
        status: 'Active',
        allowances: {
          basicSalary: salary.basicsalary || 0,
          hra: salary.hra || 0,
          conveyanceAllowance: salary.conveyanceallowance || 0,
          medicalAllowance: salary.medicalallowance || 0,
          specialAllowance: salary.specialallowance || 0,
          otherAllowances: salary.otherallowance || 0
        },
        deductions: {
          incomeTax: salary.incometax || 0,
          providentFund: salary.pf || 0,
          professionalTax: salary.professionaltax || 0,
          loanDeduction: salary.loandeduction || 0,
          otherDeductions: salary.otherdeduction || 0,
          esi: salary.esiemployee || 0
        }
      };
    });

    return mappedSalaries;
  } catch (error) {
    console.error('Error fetching salaries:', error);
    throw error;
  }
};

// Create or update a salary record
export const updateSalary = async (
  employeeId: number, 
  customerId: number, 
  allowances: SalaryAllowances, 
  deductions: SalaryDeductions
) => {
  try {
    // Check if salary record exists
    const { data: existingSalary, error: fetchError } = await supabase
      .from('salary')
      .select('salaryid')
      .eq('employeeid', employeeId)
      .eq('customerid', customerId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const salaryData = {
      employeeid: employeeId,
      customerid: customerId,
      basicsalary: allowances.basicSalary,
      hra: allowances.hra,
      conveyanceallowance: allowances.conveyanceAllowance,
      medicalallowance: allowances.medicalAllowance,
      specialallowance: allowances.specialAllowance,
      otherallowance: allowances.otherAllowances,
      incometax: deductions.incomeTax,
      pf: deductions.providentFund,
      professionaltax: deductions.professionalTax,
      loandeduction: deductions.loanDeduction,
      otherdeduction: deductions.otherDeductions,
      esiemployee: deductions.esi
    };

    if (existingSalary) {
      // Update existing record
      const { data, error: updateError } = await supabase
        .from('salary')
        .update(salaryData)
        .eq('salaryid', existingSalary.salaryid)
        .select();

      if (updateError) throw updateError;
      return data;
    } else {
      // Create new record
      const { data, error: insertError } = await supabase
        .from('salary')
        .insert(salaryData)
        .select();

      if (insertError) throw insertError;
      return data;
    }
  } catch (error) {
    console.error('Error updating salary:', error);
    throw error;
  }
};

// Generate a payslip
export const generatePayslip = async (
  employeeId: number,
  customerId: number,
  year: number,
  month: number,
  amount: number
) => {
  try {
    const payslipData = {
      employeeid: employeeId,
      customerid: customerId,
      year,
      month,
      amount,
      generatedtimestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('payslip')
      .insert(payslipData)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating payslip:', error);
    throw error;
  }
};

// Get salary stats for a customer
export const getSalaryStats = async (customerId: number) => {
  try {
    const { data: salaries, error } = await supabase
      .from('salary')
      .select(`
        basicsalary,
        hra,
        conveyanceallowance,
        medicalallowance,
        specialallowance,
        otherallowance,
        employee:employeeid (department)
      `)
      .eq('customerid', customerId);

    if (error) throw error;

    // Get all departments
    const { data: departments, error: deptsError } = await supabase
      .from('department')
      .select('departmentid, departmentname')
      .eq('customerid', customerId);

    if (deptsError) throw deptsError;

    // Calculate total salary disbursement
    const totalSalary = salaries?.reduce((sum, salary) => {
      return sum + (salary.basicsalary || 0) + (salary.hra || 0) + 
        (salary.conveyanceallowance || 0) + (salary.medicalallowance || 0) + 
        (salary.specialallowance || 0) + (salary.otherallowance || 0);
    }, 0) || 0;

    // Calculate average salary
    const averageSalary = salaries && salaries.length > 0 
      ? totalSalary / salaries.length 
      : 0;

    // Calculate department-wise salary distribution
    const departmentSalaries = new Map();
    departments?.forEach(dept => {
      departmentSalaries.set(dept.departmentid, {
        name: dept.departmentname,
        value: 0,
        fill: getRandomColor()
      });
    });

    salaries?.forEach(salary => {
      if (salary.employee?.department && departmentSalaries.has(salary.employee.department)) {
        const dept = departmentSalaries.get(salary.employee.department);
        dept.value += (salary.basicsalary || 0) + (salary.hra || 0) + 
          (salary.conveyanceallowance || 0) + (salary.medicalallowance || 0) + 
          (salary.specialallowance || 0) + (salary.otherallowance || 0);
        departmentSalaries.set(salary.employee.department, dept);
      }
    });

    return {
      totalEmployees: salaries?.length || 0,
      totalSalary,
      averageSalary,
      departmentSalaries: Array.from(departmentSalaries.values())
    };
  } catch (error) {
    console.error('Error fetching salary stats:', error);
    throw error;
  }
};

// Helper function to generate random color for charts
const getRandomColor = () => {
  const colors = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', 
    '#d0ed57', '#ffc658', '#ff8042', '#0088FE', '#00C49F'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
