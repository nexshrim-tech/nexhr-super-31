
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, History, FileText, Edit } from "lucide-react";
import { EmployeeSalary, PayslipRecord } from "@/types/salary";
import EmployeeTable from "./EmployeeTable";
import EmployeeCard from "./EmployeeCard";
import { Button } from "@/components/ui/button";
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

    // Subscribe to realtime changes
    const salaryChannel = supabase
      .channel('salary-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary'
        },
        () => fetchEmployeeSalaries()
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
        () => fetchEmployeeSalaries()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salaryChannel);
      supabase.removeChannel(employeeChannel);
    };
  }, []);

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

      // Now get all salary data
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

      // Map the data to our component format
      // We'll create a record for each employee who has a salary entry
      const mappedEmployees: EmployeeSalary[] = [];

      for (const employee of employeeData || []) {
        // Find the salary data for this employee
        const salary = salaryData?.find(s => s.employeeid === employee.employeeid);
        
        // Only include employees who have salary data
        if (salary) {
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
            status: "Paid", // Default status
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewHistory = async (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
    
    try {
      // Fetch payslip history from Supabase
      const { data, error } = await supabase
        .from('payslip')
        .select('*')
        .eq('employeeid', employee.id);

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
      const formattedPayslips = data.map(payslip => ({
        id: `PS-${payslip.year}-${payslip.month.toString().padStart(2, '0')}`,
        employee: employee.employee.name,
        period: `${getMonthName(payslip.month)} ${payslip.year}`,
        amount: payslip.amount || 0,
        date: payslip.generatedtimestamp || new Date().toISOString(),
      }));

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

  const getMonthName = (month: number) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[month - 1] || "";
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
};

export default SalaryListSection;
