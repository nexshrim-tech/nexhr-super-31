
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
  const { toast } = useToast();

  useEffect(() => {
    fetchSalaryData();
    fetchSalaryTrends();

    // Set up Supabase realtime subscription
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
          fetchSalaryData();
          fetchSalaryTrends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salaryChannel);
    };
  }, []);

  const fetchSalaryData = async () => {
    try {
      // This data will be fetched by the SalaryListSection component directly
    } catch (error) {
      console.error("Error fetching salary data:", error);
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
      const { error } = await supabase
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
        .eq('salaryid', selectedSalaryData.id);

      if (error) {
        console.error('Error updating salary:', error);
        toast({
          title: "Error",
          description: "Failed to update salary details",
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
      
      // Insert new payslip record
      const { error } = await supabase
        .from('payslip')
        .insert({
          employeeid: selectedSalaryData.id,
          year: year,
          month: month,
          amount: netAmount,
          generatedtimestamp: now.toISOString()
        });
      
      if (error) {
        console.error('Error generating payslip:', error);
        toast({
          title: "Error",
          description: "Failed to generate payslip",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success",
        description: `Payslip generated for ${selectedSalaryData.employee.name}`,
      });
      
      setOpenSalarySlip(false);
    } catch (error) {
      console.error('Error generating payslip:', error);
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
          />
        </div>
      </div>

      <PayslipDialog
        open={openSalarySlip}
        onOpenChange={setOpenSalarySlip}
        employeeData={selectedSalaryData}
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
