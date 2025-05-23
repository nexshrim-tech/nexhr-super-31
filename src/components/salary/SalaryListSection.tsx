
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { EmployeeSalary, PayslipRecord } from "@/types/salary";
import EmployeeTable from "./EmployeeTable";
import EmployeeCard from "./EmployeeCard";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PayslipHistory from "./PayslipHistory";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SalaryListSectionProps {
  employees: EmployeeSalary[];
  onGenerateSalarySlip: (employee: EmployeeSalary) => void;
  onViewLatestPayslip?: (employee: EmployeeSalary) => void;
  onUpdateSalaryDetails?: (employee: EmployeeSalary) => void;
}

// Utility function to calculate salary components based on base salary
const calculateSalaryComponents = (baseSalary: number) => {
  const basicSalaryPercentage = 0.45;
  const hraPercentage = 0.40;
  const specialAllowancePercentage = 0.10;
  const pfPercentage = 0.12;
  const incomeTaxPercentage = 0.05;
  const esiPercentage = 0.0075;
  
  const conveyanceAllowance = 1600;
  const medicalAllowance = 1250;
  const professionalTax = 200;
  
  const basicSalary = baseSalary * basicSalaryPercentage;
  const hra = baseSalary * hraPercentage;
  const specialAllowance = baseSalary * specialAllowancePercentage;
  const pf = baseSalary * pfPercentage;
  const incomeTax = baseSalary * incomeTaxPercentage;
  const esi = baseSalary * esiPercentage;
  
  return {
    basicsalary: basicSalary,
    hra: hra,
    conveyanceallowance: conveyanceAllowance,
    medicalallowance: medicalAllowance,
    specialallowance: specialAllowance,
    otherallowance: 0,
    incometax: incomeTax,
    pf: pf,
    professionaltax: professionalTax,
    esiemployee: esi,
    loandeduction: 0,
    otherdeduction: 0,
    monthlysalary: baseSalary
  };
};

const SalaryListSection: React.FC<SalaryListSectionProps> = ({ 
  employees: initialEmployees, 
  onGenerateSalarySlip,
  onViewLatestPayslip,
  onUpdateSalaryDetails
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalary | null>(null);
  const [payslipHistory, setPayslipHistory] = useState<PayslipRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeSalary[]>(initialEmployees);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployeeSalaries();

    // Set up real-time subscriptions
    const salaryChannel = supabase
      .channel('salary-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary'
        },
        () => {
          console.log('Salary data changed, refreshing...');
          fetchEmployeeSalaries();
        }
      )
      .subscribe();

    const employeeChannel = supabase
      .channel('employee-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employee'
        },
        () => {
          console.log('Employee data changed, refreshing...');
          fetchEmployeeSalaries();
        }
      )
      .subscribe();

    const payslipChannel = supabase
      .channel('payslip-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payslip'
        },
        () => {
          console.log('Payslip data changed, refreshing...');
          if (selectedEmployee) {
            handleViewHistory(selectedEmployee);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salaryChannel);
      supabase.removeChannel(employeeChannel);
      supabase.removeChannel(payslipChannel);
    };
  }, [selectedEmployee]);

  const fetchEmployeeSalaries = async () => {
    try {
      setLoading(true);
      
      // Get all employees first
      const { data: employeeData, error: employeeError } = await supabase
        .from('employee')
        .select('*');

      if (employeeError) {
        console.error('Error fetching employee data:', employeeError);
        toast({
          title: "Error",
          description: "Failed to fetch employee data",
          variant: "destructive",
        });
        return;
      }

      // Get all salary data
      const { data: salaryData, error: salaryError } = await supabase
        .from('salary')
        .select('*');

      if (salaryError) {
        console.error('Error fetching salary data:', salaryError);
        toast({
          title: "Error",
          description: "Failed to fetch salary data",
          variant: "destructive",
        });
        return;
      }

      // Get payslip data for status information
      const { data: payslipData, error: payslipError } = await supabase
        .from('payslip')
        .select('*');

      if (payslipError) {
        console.error('Error fetching payslip data:', payslipError);
      }

      // Current month and year for payslip status check
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // Map the data to our component format
      const mappedEmployees: EmployeeSalary[] = [];
      const updatedSalaries = [];

      for (const employee of employeeData || []) {
        // Find the salary data for this employee
        let salary = salaryData?.find(s => s.employeeid === employee.employeeid);
        
        // If employee has monthlysalary but no salary record or monthlysalary doesn't match, sync it
        if (employee.monthlysalary && (!salary || (salary.monthlysalary !== employee.monthlysalary))) {
          const baseSalary = employee.monthlysalary || 0;
          
          if (!salary) {
            console.log(`Creating new salary record for employee ${employee.employeeid} with salary ${baseSalary}`);
            
            const salaryComponents = calculateSalaryComponents(baseSalary);
            const customerid = employee.customerid;
            
            const newSalary = {
              salaryid: crypto.randomUUID(),
              employeeid: employee.employeeid,
              customerid: customerid,
              basicsalary: salaryComponents.basicsalary,
              hra: salaryComponents.hra,
              conveyanceallowance: salaryComponents.conveyanceallowance,
              medicalallowance: salaryComponents.medicalallowance,
              specialallowance: salaryComponents.specialallowance,
              otherallowance: salaryComponents.otherallowance,
              incometax: salaryComponents.incometax,
              pf: salaryComponents.pf, 
              professionaltax: salaryComponents.professionaltax,
              esiemployee: salaryComponents.esiemployee,
              loandeduction: salaryComponents.loandeduction,
              otherdeduction: salaryComponents.otherdeduction,
              monthlysalary: salaryComponents.monthlysalary
            };
            
            updatedSalaries.push({ type: 'insert', data: newSalary });
            salary = newSalary as any;
          } else if (salary.monthlysalary !== employee.monthlysalary) {
            console.log(`Updating salary record for employee ${employee.employeeid} from ${salary.monthlysalary} to ${employee.monthlysalary}`);
            
            const updatedComponents = calculateSalaryComponents(baseSalary);
            
            const updateSalary = {
              ...salary,
              basicsalary: updatedComponents.basicsalary,
              hra: updatedComponents.hra,
              conveyanceallowance: updatedComponents.conveyanceallowance,
              medicalallowance: updatedComponents.medicalallowance,
              specialallowance: updatedComponents.specialallowance,
              otherallowance: updatedComponents.otherallowance,
              incometax: updatedComponents.incometax,
              pf: updatedComponents.pf,
              professionaltax: updatedComponents.professionaltax,
              esiemployee: updatedComponents.esiemployee,
              monthlysalary: employee.monthlysalary
            };
            
            updatedSalaries.push({ type: 'update', id: salary.salaryid, data: updateSalary });
            salary = updateSalary;
          }
        }
        
        if (salary) {
          // Check if employee has a payslip for current month by parsing dates from payslipdate
          const hasCurrentPayslip = payslipData?.some(p => {
            if (!p.payslipdate || p.employeeid !== employee.employeeid) return false;
            const payslipDate = new Date(p.payslipdate);
            return payslipDate.getFullYear() === currentYear && 
                   (payslipDate.getMonth() + 1) === currentMonth;
          });

          mappedEmployees.push({
            id: employee.employeeid,
            employee: { 
              name: `${employee.firstname || ''} ${employee.lastname || ''}`.trim(), 
              avatar: employee.firstname ? employee.firstname[0] + (employee.lastname ? employee.lastname[0] : '') : 'EA'
            },
            position: employee.jobtitle || 'Unknown',
            department: employee.department || 'Unknown',
            salary: salary.basicsalary + 
                   salary.hra + 
                   salary.conveyanceallowance + 
                   salary.medicalallowance +
                   salary.specialallowance +
                   salary.otherallowance,
            lastIncrement: employee.joiningdate || new Date().toISOString(),
            status: hasCurrentPayslip ? "Paid" : "Pending",
            allowances: {
              basicSalary: salary.basicsalary || 0,
              hra: salary.hra || 0,
              conveyanceAllowance: salary.conveyanceallowance || 0,
              medicalAllowance: salary.medicalallowance || 0,
              specialAllowance: salary.specialallowance || 0,
              otherAllowances: salary.otherallowance || 0,
            },
            deductions: {
              incomeTax: salary.incometax || 0,
              providentFund: salary.pf || 0,
              professionalTax: salary.professionaltax || 0,
              loanDeduction: salary.loandeduction || 0,
              otherDeductions: salary.otherdeduction || 0,
              esi: salary.esiemployee || 0,
            }
          });
        }
      }

      // Batch update all salary records that need syncing
      if (updatedSalaries.length > 0) {
        console.log(`Batch updating ${updatedSalaries.length} salary records`);
        
        const inserts = updatedSalaries.filter(item => item.type === 'insert');
        if (inserts.length > 0) {
          const { error: insertError } = await supabase
            .from('salary')
            .insert(inserts.map(item => item.data));
            
          if (insertError) {
            console.error('Error inserting salary records:', insertError);
          } else {
            console.log(`Created ${inserts.length} new salary records`);
          }
        }
        
        const updates = updatedSalaries.filter(item => item.type === 'update');
        for (const update of updates) {
          const { error: updateError } = await supabase
            .from('salary')
            .update(update.data)
            .eq('salaryid', update.id);
            
          if (updateError) {
            console.error(`Error updating salary record ${update.id}:`, updateError);
          }
        }
        
        if (updates.length > 0) {
          console.log(`Updated ${updates.length} existing salary records`);
        }
      }

      setEmployees(mappedEmployees.length > 0 ? mappedEmployees : initialEmployees);
      console.log("Fetched employees with salary data:", mappedEmployees.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
    
    try {
      // Fetch payslip history from Supabase
      const { data, error } = await supabase
        .from('payslip')
        .select('*')
        .eq('employeeid', employee.id)
        .order('payslipdate', { ascending: false });

      if (error) {
        console.error('Error fetching payslip history:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payslip history",
          variant: "destructive",
        });
        return;
      }

      // Format the payslip records
      const formattedPayslips = data.map(payslip => {
        const date = new Date(payslip.payslipdate || payslip.generatedtimestamp);
        return {
          id: payslip.payslip_id,
          employee: employee.employee.name,
          period: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          amount: payslip.amount || 0,
          date: payslip.generatedtimestamp || new Date().toISOString(),
        };
      });

      setPayslipHistory(formattedPayslips);
      setOpenHistory(true);
    } catch (error) {
      console.error('Error processing payslip history:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>Employee Salaries</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table View</SelectItem>
                  <SelectItem value="card">Card View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading salary data...</div>
          ) : filteredEmployees.length > 0 ? (
            viewMode === "table" ? (
              <EmployeeTable 
                employees={filteredEmployees} 
                onGenerateSalarySlip={onGenerateSalarySlip}
                onViewHistory={handleViewHistory}
                onUpdateSalaryDetails={onUpdateSalaryDetails}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <EmployeeCard 
                    key={employee.id}
                    employee={employee} 
                    onGenerateSalarySlip={onGenerateSalarySlip}
                    onViewHistory={handleViewHistory}
                    onViewLatestPayslip={onViewLatestPayslip}
                    onUpdateSalaryDetails={onUpdateSalaryDetails}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-4">No employees with salary data found.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openHistory} onOpenChange={setOpenHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee ? `Payslip History - ${selectedEmployee.employee.name}` : "Payslip History"}
            </DialogTitle>
          </DialogHeader>
          <PayslipHistory 
            payslips={payslipHistory} 
            onViewPayslip={(id) => {
              console.log("View payslip:", id);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }
};

export default SalaryListSection;
