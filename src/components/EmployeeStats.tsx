
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserMinus, Briefcase } from "lucide-react";

const EmployeeStats = () => {
  return (
    <Card className="shadow-md border-t-2 border-t-nexhr-primary animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">Employee Statistics</CardTitle>
            <p className="text-xs text-muted-foreground">1 Jan 2024 - 20 Aug 2024</p>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="bg-muted">
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-blue-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">127</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-green text-white">
              +34%
            </Badge>
          </div>
        </div>
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-green-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">New Hires</div>
            <div className="bg-green-100 p-2 rounded-full">
              <UserPlus className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">6</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-green text-white">
              +9%
            </Badge>
          </div>
        </div>
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-red-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">Departures</div>
            <div className="bg-red-100 p-2 rounded-full">
              <UserMinus className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">2</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-red text-white">
              -5%
            </Badge>
          </div>
        </div>
        <div className="border rounded-md p-4 bg-gradient-to-tr from-white to-amber-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-muted-foreground">Layoffs</div>
            <div className="bg-amber-100 p-2 rounded-full">
              <Briefcase className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold">6</span>
              <span className="text-xs text-muted-foreground">people</span>
            </div>
            <Badge className="bg-nexhr-green text-white">
              +8%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeStats;
