
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SalaryStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Salary Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹412,000</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹82,400</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">-5 from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryStats;
