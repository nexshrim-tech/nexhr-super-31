
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmployeeStats = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">Employee stastics</CardTitle>
            <p className="text-xs text-muted-foreground">1 jan 2024 - 20 aug 2024</p>
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
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Total Employees</div>
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
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">New Hires</div>
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
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Departures</div>
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
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Layoffs</div>
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
