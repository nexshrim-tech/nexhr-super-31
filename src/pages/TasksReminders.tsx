
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Filter, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tasks = [
  {
    id: 1,
    title: "Schedule Performance Reviews",
    dueDate: "2023-08-15",
    status: "In Progress",
    priority: "High",
    assignedTo: { name: "Olivia Rhye", avatar: "OR" },
  },
  {
    id: 2,
    title: "Update Employee Handbook",
    dueDate: "2023-08-20",
    status: "To Do",
    priority: "Medium",
    assignedTo: { name: "Phoenix Baker", avatar: "PB" },
  },
  {
    id: 3,
    title: "Conduct Team Building Activity",
    dueDate: "2023-08-25",
    status: "To Do",
    priority: "Medium",
    assignedTo: { name: "Lana Steiner", avatar: "LS" },
  },
  {
    id: 4,
    title: "Review Leave Applications",
    dueDate: "2023-08-10",
    status: "Completed",
    priority: "High",
    assignedTo: { name: "Demi Wilkinson", avatar: "DW" },
  },
  {
    id: 5,
    title: "Finalize Q3 Budget",
    dueDate: "2023-08-12",
    status: "In Progress",
    priority: "High",
    assignedTo: { name: "Candice Wu", avatar: "CW" },
  },
];

const TasksReminders = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Tasks & Reminders</h1>
              <p className="text-gray-500">Manage tasks and set reminders</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-nexhr-primary" />
                        <div>
                          <div className="font-medium">Schedule Performance Reviews</div>
                          <div className="text-sm text-muted-foreground">Due in 2 days</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        High
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-nexhr-primary" />
                        <div>
                          <div className="font-medium">Team Meeting</div>
                          <div className="text-sm text-muted-foreground">Today, 2:00 PM</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                        Medium
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-nexhr-primary" />
                        <div>
                          <div className="font-medium">Review Leave Applications</div>
                          <div className="text-sm text-muted-foreground">Due in 1 week</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-800">
                        Low
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Task Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">Total Tasks</div>
                      <div className="text-2xl font-medium">15</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">Completed</div>
                      <div className="text-2xl font-medium">7</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">In Progress</div>
                      <div className="text-2xl font-medium">5</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">To Do</div>
                      <div className="text-2xl font-medium">3</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-base">All Tasks</CardTitle>
                      <Tabs defaultValue="all">
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="todo">To Do</TabsTrigger>
                          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
                          <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  task.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : task.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  task.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : task.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {task.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="" alt={task.assignedTo.name} />
                                  <AvatarFallback>{task.assignedTo.avatar}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{task.assignedTo.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  <Trash2 className="h-4 w-4" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksReminders;
