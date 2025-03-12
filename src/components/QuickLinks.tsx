
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Quick links</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/add-employee">
            <Plus className="h-4 w-4" />
            Add new employees
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/assets">
            <BarChart2 className="h-4 w-4" />
            Assets
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/expenses">
            <CreditCard className="h-4 w-4" />
            Expense
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;
