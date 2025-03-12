
import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Search,
  Filter,
  UserCog,
  Eye,
  CalendarCheck,
  Calendar,
  UserCheck,
} from "lucide-react";

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
    status: "Absent",
    role: "Frontend Developer",
    email: "lana@untitledui.com",
    departments: ["Design", "Product", "Marketing"],
  },
  {
    name: "Demi Wilkinson",
    username: "@demi",
    avatar: "DW",
    status: "Late",
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Present":
      return "bg-green-500";
    case "Absent":
      return "bg-red-500";
    case "Late":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Today's date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Attendance stats for today
  const presentCount = employees.filter(emp => emp.status === "Present").length;
  const absentCount = employees.filter(emp => emp.status === "Absent").length;
  const lateCount = employees.filter(emp => emp.status === "Late").length;
  
  // Filter employees based on search term, status, and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      employee.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      employee.departments.some(dept => dept.toLowerCase() === departmentFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Today's Attendance Widget */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Today's Attendance
            </CardTitle>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-50 p-3 rounded-md text-center">
                <div className="text-2xl font-semibold text-green-600">{presentCount}</div>
                <div className="text-xs text-green-700">Present</div>
              </div>
              <div className="bg-red-50 p-3 rounded-md text-center">
                <div className="text-2xl font-semibold text-red-600">{absentCount}</div>
                <div className="text-xs text-red-700">Absent</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md text-center">
                <div className="text-2xl font-semibold text-yellow-600">{lateCount}</div>
                <div className="text-xs text-yellow-700">Late</div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="w-full gap-1 mr-2">
                <Calendar className="h-4 w-4" />
                View Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <UserCheck className="h-4 w-4" />
                Mark Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees section title */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Employees</h2>
            <Badge variant="outline" className="bg-gray-100">
              {filteredEmployees.length} users
            </Badge>
          </div>
          
          {/* Search and filter section */}
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDepartmentFilter("all");
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
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
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(employee.status)}`}></span>
                    <span>{employee.status}</span>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Employee Profile</DialogTitle>
                          <DialogDescription>
                            View employee details and information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedEmployee && (
                          <div className="py-4">
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback>{selectedEmployee.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedEmployee.username}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="font-medium">{selectedEmployee.role}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{selectedEmployee.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className="flex items-center gap-1">
                                  <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedEmployee.status)}`}></span>
                                  <span>{selectedEmployee.status}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Departments</p>
                                <div className="flex flex-wrap gap-1">
                                  {selectedEmployee.departments.map((dept: string, i: number) => (
                                    <Badge variant="outline" key={i}>{dept}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                          <UserCog className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Employee</DialogTitle>
                          <DialogDescription>
                            Make changes to employee information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedEmployee && (
                          <div className="py-4 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback>{selectedEmployee.avatar}</AvatarFallback>
                              </Avatar>
                              <Button variant="outline" size="sm">Change Photo</Button>
                            </div>
                            
                            <div className="grid gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input defaultValue={selectedEmployee.name} />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input defaultValue={selectedEmployee.email} />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Role</label>
                                <Input defaultValue={selectedEmployee.role} />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Select defaultValue={selectedEmployee.status.toLowerCase()}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>Save Changes</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
