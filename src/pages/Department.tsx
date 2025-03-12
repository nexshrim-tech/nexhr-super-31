
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const departments = [
  {
    id: 1,
    name: "Engineering",
    manager: "Demi Wilkinson",
    employeeCount: 32,
    budget: 500000,
    status: "Active",
  },
  {
    id: 2,
    name: "Design",
    manager: "Olivia Rhye",
    employeeCount: 18,
    budget: 250000,
    status: "Active",
  },
  {
    id: 3,
    name: "Product",
    manager: "Phoenix Baker",
    employeeCount: 12,
    budget: 200000,
    status: "Active",
  },
  {
    id: 4,
    name: "Marketing",
    manager: "Drew Cano",
    employeeCount: 15,
    budget: 300000,
    status: "Active",
  },
  {
    id: 5,
    name: "Sales",
    manager: "Orlando Diggs",
    employeeCount: 20,
    budget: 400000,
    status: "Active",
  },
  {
    id: 6,
    name: "Human Resources",
    manager: "Candice Wu",
    employeeCount: 8,
    budget: 150000,
    status: "Active",
  },
  {
    id: 7,
    name: "Finance",
    manager: "Natali Craig",
    employeeCount: 10,
    budget: 200000,
    status: "Active",
  },
];

const Department = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Departments</h1>
              <p className="text-gray-500">Manage organization departments</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">7</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">115</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">$2M</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Avg Team Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">16</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Department List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Annual Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">{department.name}</TableCell>
                        <TableCell>{department.manager}</TableCell>
                        <TableCell>{department.employeeCount}</TableCell>
                        <TableCell>${department.budget.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {department.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div>Engineering</div>
                    </div>
                    <div>28%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <div>Design</div>
                    </div>
                    <div>16%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>Product</div>
                    </div>
                    <div>10%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div>Marketing</div>
                    </div>
                    <div>13%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div>Sales</div>
                    </div>
                    <div>17%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500" />
                      <div>Human Resources</div>
                    </div>
                    <div>7%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <div>Finance</div>
                    </div>
                    <div>9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>Engineering</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "25%" }} />
                    </div>
                    <div>25%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Design</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "12.5%" }} />
                    </div>
                    <div>12.5%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Product</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <div>10%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Marketing</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "15%" }} />
                    </div>
                    <div>15%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Sales</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "20%" }} />
                    </div>
                    <div>20%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Human Resources</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: "7.5%" }} />
                    </div>
                    <div>7.5%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Finance</div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <div>10%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
