
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveHistoryTable from './LeaveHistoryTable';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("all");
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
    // Filter by leave type
    const typeMatch = activeTab === "all" ? true : 
      balance.type.toLowerCase().includes(activeTab.toLowerCase());
    
    // Filter by search query
    const searchMatch = searchQuery === "" ? true :
      balance.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      balance.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by balance amount
    let balanceMatch = true;
    if (balanceFilter === "low") {
      balanceMatch = balance.balance <= 5;
    } else if (balanceFilter === "medium") {
      balanceMatch = balance.balance > 5 && balance.balance <= 10;
    } else if (balanceFilter === "high") {
      balanceMatch = balance.balance > 10;
    }
    
    return typeMatch && searchMatch && balanceMatch;
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
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search employee..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select 
              value={balanceFilter} 
              onValueChange={setBalanceFilter}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by balance" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Balances</SelectItem>
                <SelectItem value="low">Low Balance (≤ 5)</SelectItem>
                <SelectItem value="medium">Medium Balance (6-10)</SelectItem>
                <SelectItem value="high">High Balance (> 10)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
