
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

const employees = [
  {
    name: "Olivia Rhye",
    username: "@olivia",
    avatar: "OR",
    status: "Present",
    role: "Product Designer",
    email: "olivia@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Phoenix Baker",
    username: "@phoenix",
    avatar: "PB",
    status: "Present",
    role: "Product Manager",
    email: "phoenix@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Lana Steiner",
    username: "@lana",
    avatar: "LS",
    status: "Present",
    role: "Frontend Developer",
    email: "lana@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Demi Wilkinson",
    username: "@demi",
    avatar: "DW",
    status: "Present",
    role: "Backend Developer",
    email: "demi@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Candice Wu",
    username: "@candice",
    avatar: "CW",
    status: "Present",
    role: "Fullstack Developer",
    email: "candice@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Natali Craig",
    username: "@natali",
    avatar: "NC",
    status: "Present",
    role: "UX Designer",
    email: "natali@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Drew Cano",
    username: "@drew",
    avatar: "DC",
    status: "Present",
    role: "UX Copywriter",
    email: "drew@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Orlando Diggs",
    username: "@orlando",
    avatar: "OD",
    status: "Present",
    role: "UI Designer",
    email: "orlando@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Andi Lane",
    username: "@andi",
    avatar: "AL",
    status: "Present",
    role: "Product Manager",
    email: "andi@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Kate Morrison",
    username: "@kate",
    avatar: "KM",
    status: "Present",
    role: "QA Engineer",
    email: "kate@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
];

const EmployeeList = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Employees</h2>
        <Badge variant="outline" className="bg-gray-100">
          100 users
        </Badge>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Status <ChevronRight className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Role <HelpCircle className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Email address</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.username}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{employee.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {employee.username}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Present</span>
                  </div>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {employee.departments.map((department, index) => (
                      <span key={index} className="text-violet-600 text-sm">
                        {department}
                      </span>
                    ))}
                    <span className="text-sm">+4</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="outline" className="h-8 w-8 p-0 rounded-md">
            1
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
            2
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
            3
          </Button>
          <span className="mx-1">...</span>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
            8
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
            9
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
            10
          </Button>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmployeeList;
