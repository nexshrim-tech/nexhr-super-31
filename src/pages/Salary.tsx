import React, { useState, useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import { useToast } from "@/hooks/use-toast";
import SalaryStats from "@/components/salary/SalaryStats";
import SalaryTrends from "@/components/salary/SalaryTrends";
import SalaryListSection from "@/components/salary/SalaryListSection";
import PayslipDialog from "@/components/salary/PayslipDialog";
import { EmployeeSalary, SalaryData, SalaryAllowances, SalaryDeductions } from "@/types/salary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import SalaryDetailsForm from "@/components/SalaryDetailsForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Sample departmental data
const departmentSalaryData = [
  { name: "Engineering", value: 150000, fill: "#8884d8" },
  { name: "Design", value: 75000, fill: "#83a6ed" },
  { name: "Product", value: 85000, fill: "#8dd1e1" },
  { name: "Marketing", value: 60000, fill: "#82ca9d" },
  { name: "Sales", value: 50000, fill: "#a4de6c" },
];

const employeeGrowthData = [
  { name: "Q1", growth: 2.5 },
  { name: "Q2", growth: 3.1 },
  { name: "Q3", growth: 2.8 },
  { name: "Q4", growth: 3.5 },
];

const Salary = () => {
  const [openSalarySlip, setOpenSalarySlip] = useState(false);
  const [openSalaryForm, setOpenSalaryForm] = useState(false);
  const [selectedSalaryData, setSelectedSalaryData] = useState<EmployeeSalary | null>(null);
  const [employeeSalaries, setEmployeeSalaries] = useState<EmployeeSalary[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Improved fetch and subscription setup
  useEffect(() => {
    // Initial data fetch
    fetchSalaryData();
    fetchSalaryTrends();

    // Set up real-time subscriptions with better error handling
    const salaryChannel = supabase
      .channel('salary-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary'
        },
        (payload) => {
          console.log('Salary table updated:', payload.eventType);
          fetchSalaryData();
          fetchSalaryTrends();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payslip'
        },
        (payload) => {
          console.log('Payslip table updated:', payload.eventType);
          fetchSalaryData();
          fetchSalaryTrends();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'employee'
        },
        (payload) => {
          console.log('Employee table updated:', payload.eventType);
          fetchSalaryData();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else {
          console.log('Subscription status:', status);
        }
      });

    return () => {
      // Clean up subscription
      supabase.removeChannel(salaryChannel);
    };
  }, []);

  const fetchSalaryData = async () => {
    try {
      console.log("Fetching salary data from Supabase...");
      setLoading(true);
      
      // Get employee data with proper error handling
      const { data: employeeData, error: employeeError } = await supabase
        .from('employee')
        .select('*');

      if (employeeError) {
        console.error("Error fetching employee data:", employeeError);
        toast({
          title: "Error",
          description: "Failed to fetch employee data: " + employeeError.message,
          variant: "destructive",
        });
        return;
      }

      // Get salary data with proper error handling
      const { data: salaryData, error: salaryError } = await supabase
        .from('salary')
        .select('*');

      if (salaryError) {
        console.error("Error fetching salary data:", salaryError);
        toast({
          title: "Error",
          description: "Failed to fetch salary data: " + salaryError.message,
          variant: "destructive",
        });
        return;
      }

      // Get current year and month for payslip status
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      // Fetch payslips for status determination
      const { data: payslipData, error: payslipError } = await supabase
        .from('payslip')
        .select('*')
        .eq('year', currentYear)
        .eq('month', currentMonth);
      
      if (payslipError) {
        console.error("Error fetching payslip data:", payslipError);
      }

      // Map employee data with salary information
      const employeesWithSalary = employeeData
        .filter(emp => salaryData.some(sal => sal.employeeid === emp.employeeid))
        .map(emp => {
          const salary = salaryData.find(sal => sal.employeeid === emp.employeeid);
          
          // Check if employee has a payslip for current month
          const hasCurrentPayslip = payslipData?.some(p => p.employeeid === emp.employeeid);
          
          // Calculate total salary components
          const totalAllowances = (salary?.basicsalary || 0) + 
                                 (salary?.hra || 0) + 
                                 (salary?.conveyanceallowance || 0) +
                                 (salary?.medicalallowance || 0) +
                                 (salary?.specialallowance || 0) +
                                 (salary?.otherallowance || 0);
          
          return {
            id: emp.employeeid,
            employee: {
              name: `${emp.firstname || ''} ${emp.lastname || ''}`.trim(),
              avatar: emp.firstname ? emp.firstname[0] + (emp.lastname ? emp.lastname[0] : '') : 'EA'
            },
            position: emp.jobtitle || 'Unknown',
            department: emp.department || 'Unknown',
            salary: totalAllowances,
            lastIncrement: emp.joiningdate || new Date().toISOString(),
            status: hasCurrentPayslip ? "Paid" : "Pending",
            allowances: {
              basicSalary: salary?.basicsalary || 0,
              hra: salary?.hra || 0,
              conveyanceAllowance: salary?.conveyanceallowance || 0,
              medicalAllowance: salary?.medicalallowance || 0,
              specialAllowance: salary?.specialallowance || 0,
              otherAllowances: salary?.otherallowance || 0
            },
            deductions: {
              incomeTax: salary?.incometax || 0,
              providentFund: salary?.pf || 0,
              professionalTax: salary?.professionaltax || 0,
              esi: salary?.esiemployee || 0,
              loanDeduction: salary?.loandeduction || 0,
              otherDeductions: salary?.otherdeduction || 0
            }
          };
        });
      
      console.log(`Found ${employeesWithSalary.length} employees with salary data`);
      setEmployeeSalaries(employeesWithSalary);
    } catch (error) {
      console.error("Error processing salary data:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while processing salary data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaryTrends = async () => {
    try {
      // Get current year and previous months
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Calculate months for salary trends (current month and previous 7 months)
      const months = [];
      for (let i = 7; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        
        months.push({ month, year });
      }

      // Fetch payslip data aggregated by month
      const trends: SalaryData[] = [];
      
      for (const { month, year } of months) {
        const { data, error } = await supabase
          .from('payslip')
          .select('amount')
          .eq('month', month)
          .eq('year', year);

        if (error) {
          console.error('Error fetching payslip data:', error);
          continue;
        }

        const totalAmount = data.reduce((sum, record) => sum + (record.amount || 0), 0);
        trends.push({
          month: getMonthName(month).substring(0, 3),
          amount: totalAmount
        });
      }

      setSalaryData(trends);
    } catch (error) {
      console.error("Error fetching salary trends:", error);
    }
  };

  const getMonthName = (month: number) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[month - 1] || "";
  };

  const handleGeneratePayslip = async () => {
    if (!selectedSalaryData) return;
    
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      // Calculate total amount (sum of allowances - deductions)
      const totalAllowances = Object.values(selectedSalaryData.allowances).reduce((sum, value) => sum + value, 0);
      const totalDeductions = Object.values(selectedSalaryData.deductions).reduce((sum, value) => sum + value, 0);
      const netAmount = totalAllowances - totalDeductions;
      
      // Check if a payslip already exists for this month/year/employee
      const { data: existingPayslip, error: checkError } = await supabase
        .from('payslip')
        .select('payslipid')
        .eq('employeeid', selectedSalaryData.id.toString())
        .eq('year', year)
        .eq('month', month);
        
      if (checkError) {
        console.error('Error checking for existing payslip:', checkError);
        toast({
          title: "Error",
          description: "Failed to check for existing payslip",
          variant: "destructive"
        });
        return;
      }
      
      let result;
      
      if (existingPayslip && existingPayslip.length > 0) {
        // Update existing payslip
        result = await supabase
          .from('payslip')
          .update({
            amount: netAmount,
            generatedtimestamp: now.toISOString()
          })
          .eq('payslipid', existingPayslip[0].payslipid);
          
        toast({
          title: "Success",
          description: `Payslip updated for ${selectedSalaryData.employee.name}`,
        });
      } else {
        // Insert new payslip record
        result = await supabase
          .from('payslip')
          .insert({
            employeeid: selectedSalaryData.id.toString(),
            year: year,
            month: month,
            amount: netAmount,
            generatedtimestamp: now.toISOString()
          });
          
        toast({
          title: "Success",
          description: `Payslip generated for ${selectedSalaryData.employee.name}`,
        });
      }
      
      if (result.error) {
        console.error('Error generating payslip:', result.error);
        toast({
          title: "Error",
          description: "Failed to generate payslip",
          variant: "destructive"
        });
        return;
      }
      
      // Close the dialog and refresh data
      setOpenSalarySlip(false);
      fetchSalaryData(); // Refresh data to update status
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleGenerateSalarySlip = (employeeData: EmployeeSalary) => {
    setSelectedSalaryData(employeeData);
    setOpenSalarySlip(true);
  };

  const handleViewLatestPayslip = (employeeData: EmployeeSalary) => {
    setSelectedSalaryData(employeeData);
    setOpenSalarySlip(true);
    toast({
      title: "Viewing latest payslip",
      description: `Showing payslip for ${employeeData.employee.name}`,
    });
  };

  const handleUpdateSalaryDetails = (employee: EmployeeSalary) => {
    setSelectedSalaryData(employee);
    setOpenSalaryForm(true);
  };

  const handleSaveSalaryDetails = async (allowances: SalaryAllowances, deductions: SalaryDeductions) => {
    if (!selectedSalaryData) return;

    try {
      // Check if salary record exists
      const { data: existingSalary, error: checkError } = await supabase
        .from('salary')
        .select('salaryid')
        .eq('employeeid', selectedSalaryData.id.toString())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 just means no rows found, which is fine
        console.error('Error checking for existing salary:', checkError);
        toast({
          title: "Error",
          description: "Failed to check for existing salary record",
          variant: "destructive"
        });
        return;
      }

      let result;
      
      if (existingSalary) {
        // Update existing salary
        result = await supabase
          .from('salary')
          .update({
            basicsalary: allowances.basicSalary,
            hra: allowances.hra,
            conveyanceallowance: allowances.conveyanceAllowance,
            medicalallowance: allowances.medicalAllowance,
            specialallowance: allowances.specialAllowance,
            otherallowance: allowances.otherAllowances,
            incometax: deductions.incomeTax,
            pf: deductions.providentFund,
            professionaltax: deductions.professionalTax,
            esiemployee: deductions.esi,
            loandeduction: deductions.loanDeduction,
            otherdeduction: deductions.otherDeductions
          })
          .eq('employeeid', selectedSalaryData.id.toString());
      } else {
        // Insert new salary record
        result = await supabase
          .from('salary')
          .insert({
            employeeid: selectedSalaryData.id.toString(),
            basicsalary: allowances.basicSalary,
            hra: allowances.hra,
            conveyanceallowance: allowances.conveyanceAllowance,
            medicalallowance: allowances.medicalAllowance,
            specialallowance: allowances.specialAllowance,
            otherallowance: allowances.otherAllowances,
            incometax: deductions.incomeTax,
            pf: deductions.providentFund,
            professionaltax: deductions.professionalTax,
            esiemployee: deductions.esi,
            loandeduction: deductions.loanDeduction,
            otherdeduction: deductions.otherDeductions
          });
      }

      if (result.error) {
        console.error('Error saving salary details:', result.error);
        toast({
          title: "Error",
          description: "Failed to save salary details",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `Salary updated for ${selectedSalaryData.employee.name}`,
      });

      setOpenSalaryForm(false);
    } catch (error) {
      console.error('Error updating salary:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Salary Management</h1>
          </div>

          <SalaryStats />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Salary Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentSalaryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {departmentSalaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Salary Growth Rate (Quarterly)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employeeGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar 
                        dataKey="growth" 
                        fill="#8884d8" 
                        animationBegin={0}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <SalaryTrends data={salaryData} />
          
          <SalaryListSection 
            employees={employeeSalaries} 
            onGenerateSalarySlip={handleGenerateSalarySlip}
            onViewLatestPayslip={handleViewLatestPayslip}
            onUpdateSalaryDetails={handleUpdateSalaryDetails}
          />
        </div>
      </div>

      <PayslipDialog
        open={openSalarySlip}
        onOpenChange={setOpenSalarySlip}
        employeeData={selectedSalaryData}
        onGeneratePayslip={handleGeneratePayslip}
      />

      {selectedSalaryData && (
        <SalaryDetailsForm
          isOpen={openSalaryForm}
          onClose={() => setOpenSalaryForm(false)}
          employeeName={selectedSalaryData.employee.name}
          initialSalary={selectedSalaryData.salary}
          onSave={handleSaveSalaryDetails}
          initialAllowances={selectedSalaryData.allowances}
          initialDeductions={selectedSalaryData.deductions}
        />
      )}
    </div>
  );
};

export default Salary;
