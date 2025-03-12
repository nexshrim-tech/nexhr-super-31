
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart2, CreditCard, Calendar, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Quick links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/add-employee">
            <Plus className="h-4 w-4" />
            Add employee
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
            Expenses
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/attendance">
            <Calendar className="h-4 w-4" />
            Attendance
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/all-employees">
            <Users className="h-4 w-4" />
            Employees
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 rounded-md" asChild>
          <Link to="/documents">
            <FileText className="h-4 w-4" />
            Documents
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;
