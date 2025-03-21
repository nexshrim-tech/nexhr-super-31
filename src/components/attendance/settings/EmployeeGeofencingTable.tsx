
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import FeatureToggle from "./FeatureToggle";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  geofencingEnabled: boolean;
}

// Sample employee data - in a real application, this would come from a database/API
const sampleEmployees: Employee[] = [{
  id: "EMP001",
  name: "Olivia Rhye",
  department: "Engineering",
  position: "Frontend Developer",
  geofencingEnabled: true
}, {
  id: "EMP002",
  name: "Phoenix Baker",
  department: "Design",
  position: "UI Designer",
  geofencingEnabled: false
}, {
  id: "EMP003",
  name: "Lana Steiner",
  department: "Engineering",
  position: "Backend Developer",
  geofencingEnabled: true
}, {
  id: "EMP004",
  name: "Demi Wilkinson",
  department: "Marketing",
  position: "Content Writer",
  geofencingEnabled: true
}, {
  id: "EMP005",
  name: "Candice Wu",
  department: "Sales",
  position: "Account Executive",
  geofencingEnabled: false
}, {
  id: "EMP006",
  name: "Natali Craig",
  department: "HR",
  position: "HR Manager",
  geofencingEnabled: true
}, {
  id: "EMP007",
  name: "Drew Cano",
  department: "Finance",
  position: "Financial Analyst",
  geofencingEnabled: false
}];

interface EmployeeGeofencingTableProps {
  masterGeofencingEnabled: boolean;
}

const EmployeeGeofencingTable = ({
  masterGeofencingEnabled
}: EmployeeGeofencingTableProps) => {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.id.toLowerCase().includes(searchTerm.toLowerCase()) || employee.department.toLowerCase().includes(searchTerm.toLowerCase()));

  // Toggle geofencing for a specific employee
  const toggleEmployeeGeofencing = (employeeId: string, enabled: boolean) => {
    setEmployees(employees.map(emp => emp.id === employeeId ? {
      ...emp,
      geofencingEnabled: enabled
    } : emp));
  };

  return <Card className="w-full max-w-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Employee Geofencing Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-9 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="border rounded-md overflow-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="hover:bg-muted/80">
                  <TableHead className="w-[15%] py-4 h-14">Employee ID</TableHead>
                  <TableHead className="w-[30%] py-4">Name</TableHead>
                  <TableHead className="w-[20%] py-4">Department</TableHead>
                  <TableHead className="w-[20%] py-4">Position</TableHead>
                  <TableHead className="w-[15%] text-right py-4 pr-6">Geofencing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? filteredEmployees.map(employee => <TableRow key={employee.id} className="h-16 hover:bg-muted/50">
                      <TableCell className="font-medium py-4">{employee.id}</TableCell>
                      <TableCell className="py-4">{employee.name}</TableCell>
                      <TableCell className="py-4">{employee.department}</TableCell>
                      <TableCell className="py-4">{employee.position}</TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <FeatureToggle title="" description="" enabled={employee.geofencingEnabled} onToggle={checked => toggleEmployeeGeofencing(employee.id, checked)} id={`geofencing-${employee.id}`} disabled={!masterGeofencingEnabled} size="small" />
                      </TableCell>
                    </TableRow>) : <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      No employees found
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </div>
          
          {!masterGeofencingEnabled && <p className="text-sm text-muted-foreground italic mt-4">
              Note: Individual settings are disabled because master geofencing is turned off.
              Enable geofencing in the settings panel to customize per employee.
            </p>}
        </div>
      </CardContent>
    </Card>;
};

export default EmployeeGeofencingTable;
