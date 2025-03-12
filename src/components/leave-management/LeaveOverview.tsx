
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface LeaveData {
  type: string;
  total: number;
  used: number;
  balance: number;
}

interface LeaveHistoryItem {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
}

interface LeaveOverviewProps {
  balanceData: LeaveData[];
  historyData: LeaveHistoryItem[];
}

const LeaveOverview = ({ balanceData, historyData }: LeaveOverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Leave Overview</CardTitle>
        <Tabs defaultValue="balance" className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="balance" className="space-y-4 mt-0">
          {balanceData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{item.type}</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {item.used}/{item.total}
                </div>
                <div className="font-medium">{item.balance} days</div>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="history" className="mt-0">
          <div className="space-y-4">
            {historyData.map((leave) => (
              <div key={leave.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <div className="font-medium">{leave.type}</div>
                  <div className="text-sm">{leave.duration}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div>{leave.startDate} to {leave.endDate}</div>
                  <Badge className="bg-gray-100 text-gray-800">
                    {leave.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default LeaveOverview;
