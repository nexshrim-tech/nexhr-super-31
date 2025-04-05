
import React, { useEffect, useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalaryStats from "@/components/salary/SalaryStats";
import SalaryTrends from "@/components/salary/SalaryTrends";
import SalaryListSection from "@/components/salary/SalaryListSection";
import SalaryFormDialog from "@/components/salary/SalaryFormDialog";
import SalarySlipGenerator from "@/components/salary/SalarySlipGenerator";
import PayslipHistoryDialog from "@/components/salary/PayslipHistoryDialog";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, FileSpreadsheet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { getCurrentCustomer } from "@/services/customerService";
import { getEmployees, Employee } from "@/services/employeeService";
import { getSalaries, getSalaryByEmployeeId, Salary as SalaryType } from "@/services/salaryService";
import { EmployeeSalary, SalaryData } from "@/types/salary";
import { useToast } from "@/hooks/use-toast";

const SalaryPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState<EmployeeSalary[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [isOpenSalaryForm, setIsOpenSalaryForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalary | null>(null);
  const [isGeneratingSalarySlip, setIsGeneratingSalarySlip] = useState(false);
  const [isOpenPayslipHistory, setIsOpenPayslipHistory] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const customer = await getCurrentCustomer(user);
          if (customer) {
            setCustomerId(customer.customerid);
            
            // Fetch employees and their salary information
            const employeeList = await getEmployees(customer.customerid);
            const salaries = await getSalaries(customer.customerid);
            
            // Transform employee data to match EmployeeSalary type
            const employeeSalaryData = await Promise.all(employeeList.map(async (emp: Employee) => {
              // For each employee, try to get their salary
              const salaryInfo = salaries.find((s: SalaryType) => s.employeeid === emp.employeeid);
              
              // Mock data for allowances and deductions (in real implementation, we'd fetch these)
              return {
                id: emp.employeeid,
                employee: { 
                  name: `${emp.firstname} ${emp.lastname}`, 
                  avatar: emp.firstname.charAt(0) + emp.lastname.charAt(0) 
                },
                position: emp.jobtitle || 'Employee',
                department: '',  // We'll update this below
                salary: salaryInfo ? salaryInfo.netsalary : (emp.salary || 0),
                lastIncrement: salaryInfo ? salaryInfo.effectivedate : new Date().toISOString(),
                status: salaryInfo ? 'Paid' : 'Pending',
                allowances: {
                  basicSalary: salaryInfo ? salaryInfo.basesalary : (emp.salary || 0) * 0.6,
                  hra: (emp.salary || 0) * 0.2,
                  conveyanceAllowance: 1500,
                  medicalAllowance: 1000,
                  specialAllowance: 2000,
                  otherAllowances: 1000
                },
                deductions: {
                  incomeTax: (emp.salary || 0) * 0.1,
                  providentFund: (emp.salary || 0) * 0.12,
                  professionalTax: 200,
                  loanDeduction: 0,
                  otherDeductions: 0,
                  esi: (emp.salary || 0) * 0.0075
                }
              };
            }));
            
            // Get department names for each employee
            const deptMap = new Map();
            for (const emp of employeeSalaryData) {
              const employee = employeeList.find(e => e.employeeid === emp.id);
              if (employee && employee.department) {
                // If we haven't cached this department yet, fetch it
                if (!deptMap.has(employee.department)) {
                  try {
                    const { name } = await import('@/services/departmentService')
                      .then(module => module.getDepartmentById(employee.department));
                    deptMap.set(employee.department, name || 'Unknown');
                  } catch (error) {
                    console.error(`Failed to get department name for id ${employee.department}:`, error);
                    deptMap.set(employee.department, 'Unknown');
                  }
                }
                emp.department = deptMap.get(employee.department);
              } else {
                emp.department = 'Unassigned';
              }
            }
            
            setEmployees(employeeSalaryData);
            
            // Create salary trend data (mock data for now)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const trendData = months.map(month => ({
              month,
              amount: Math.floor(Math.random() * 50000) + 50000
            }));
            setSalaryData(trendData);
          }
        }
      } catch (error) {
        console.error("Error fetching salary data:", error);
        toast({
          title: "Error loading salary data",
          description: "Could not load salary information. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleGenerateSalarySlip = (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
    setIsGeneratingSalarySlip(true);
  };

  const handleViewPayslipHistory = (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
    setIsOpenPayslipHistory(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <UserHeader title="Salary Management" />
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent flex items-center">
              Salary Management
              <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse-slow" />
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-nexhr-primary to-purple-600 mt-1 mb-3 rounded-full"></div>
            <p className="text-gray-600">Manage employee salaries and generate payslips</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="salaries">Employee Salaries</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => {}}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsOpenSalaryForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Salary
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-4">
            <SalaryStats 
              customerId={customerId} 
              isLoading={isLoading}
            />
            <SalaryTrends data={salaryData} />
          </TabsContent>

          <TabsContent value="salaries" className="mt-0">
            <SalaryListSection
              employees={employees}
              onGenerateSalarySlip={handleGenerateSalarySlip}
              onViewLatestPayslip={handleViewPayslipHistory}
            />
          </TabsContent>

          <TabsContent value="payroll" className="mt-0">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Payroll Processing</h3>
              <p className="text-gray-500 mb-4">
                Manage monthly payroll, tax deductions, and salary disbursements.
              </p>
              <Button>Process Payroll</Button>
            </div>
          </TabsContent>
        </div>
      </div>

      <SalaryFormDialog
        isOpen={isOpenSalaryForm}
        onOpenChange={setIsOpenSalaryForm}
        employeeList={employees.map((emp) => ({
          id: emp.id,
          name: emp.employee.name,
          department: emp.department,
          position: emp.position
        }))}
      />

      <SalarySlipGenerator
        isOpen={isGeneratingSalarySlip}
        onOpenChange={setIsGeneratingSalarySlip}
        employee={selectedEmployee}
      />

      <PayslipHistoryDialog
        isOpen={isOpenPayslipHistory}
        onOpenChange={setIsOpenPayslipHistory}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default SalaryPage;
