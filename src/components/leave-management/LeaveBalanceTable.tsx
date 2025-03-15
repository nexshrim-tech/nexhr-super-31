
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveHistoryTable from './LeaveHistoryTable';
import { useToast } from "@/hooks/use-toast";

interface LeaveBalanceItem {
  id: number;
  employeeId: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
  balance: number;
}

interface LeaveBalanceTableProps {
  balanceData: LeaveBalanceItem[];
}

const LeaveBalanceTable: React.FC<LeaveBalanceTableProps> = ({ balanceData }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [leaveBalances, setLeaveBalances] = useState(balanceData);
  const { toast } = useToast();

  const handleUpdateLeaveBalance = (id: number, type: string, newBalance: number) => {
    setLeaveBalances(prevBalances => 
      prevBalances.map(balance => 
        balance.id === id ? { ...balance, balance: newBalance } : balance
      )
    );
    
    toast({
      title: "Leave Balance Updated",
      description: `${type} balance has been updated to ${newBalance} days.`,
    });
  };

  const filteredBalances = leaveBalances.filter(balance => {
    if (activeTab === "all") return true;
    return balance.type.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-base">Employee Leave Balances</CardTitle>
          <Tabs 
            defaultValue="all" 
            onValueChange={setActiveTab}
            className="w-full max-w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
              <TabsTrigger value="sick">Sick</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <LeaveHistoryTable 
          historyData={filteredBalances} 
          showEmployee={true}
          showLeaveBalance={true}
          onUpdateLeaveBalance={handleUpdateLeaveBalance}
        />
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceTable;
