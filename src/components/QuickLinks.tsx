
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart2, CreditCard } from "lucide-react";

const QuickLinks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Quick links</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2 rounded-md">
          <Plus className="h-4 w-4" />
          Add new employees
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md">
          <BarChart2 className="h-4 w-4" />
          Assets
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md">
          <CreditCard className="h-4 w-4" />
          Expense
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;
