
import React from "react";
import { Link } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Sample ticket data
const tickets = [
  {
    id: "HD-1001",
    title: "Computer not starting",
    status: "Open",
    priority: "High",
    department: "IT Support",
    requestedBy: "John Doe",
    requestedAt: "2 hours ago",
    avatar: "JD",
  },
  {
    id: "HD-1002",
    title: "Access to HR portal",
    status: "In Progress",
    priority: "Medium",
    department: "IT Support",
    requestedBy: "Jane Smith",
    requestedAt: "1 day ago",
    avatar: "JS",
  },
  {
    id: "HD-1003",
    title: "Email not syncing on mobile",
    status: "Pending",
    priority: "Low",
    department: "IT Support",
    requestedBy: "Mike Johnson",
    requestedAt: "2 days ago",
    avatar: "MJ",
  },
  {
    id: "HD-1004",
    title: "Payroll discrepancy",
    status: "Resolved",
    priority: "Medium",
    department: "Finance",
    requestedBy: "Sarah Williams",
    requestedAt: "3 days ago",
    avatar: "SW",
  },
  {
    id: "HD-1005",
    title: "New monitor request",
    status: "Open",
    priority: "Low",
    department: "IT Support",
    requestedBy: "Robert Brown",
    requestedAt: "4 days ago",
    avatar: "RB",
  },
];

const HelpDesk = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Help Desk</h1>
              <p className="text-gray-500">Manage support tickets and requests</p>
            </div>
            <Link to="/">
              <Button>Back</Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search tickets..."
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Open</TabsTrigger>
                <TabsTrigger value="in-progress" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">In Progress</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Pending</TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Resolved</TabsTrigger>
              </TabsList>
              <div className="flex space-x-2 text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{ticket.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{ticket.title}</h3>
                              <Badge
                                variant={
                                  ticket.status === "Open"
                                    ? "destructive"
                                    : ticket.status === "In Progress"
                                    ? "default"
                                    : ticket.status === "Pending"
                                    ? "secondary"
                                    : "outline"
                                }
                                className={
                                  ticket.status === "Resolved"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {ticket.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  ticket.priority === "High"
                                    ? "border-red-300 text-red-800"
                                    : ticket.priority === "Medium"
                                    ? "border-yellow-300 text-yellow-800"
                                    : "border-green-300 text-green-800"
                                }
                              >
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.id} • {ticket.department} • Requested by {ticket.requestedBy} {ticket.requestedAt}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "Open")
                  .map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>{ticket.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{ticket.title}</h3>
                                <Badge variant="destructive">
                                  {ticket.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    ticket.priority === "High"
                                      ? "border-red-300 text-red-800"
                                      : ticket.priority === "Medium"
                                      ? "border-yellow-300 text-yellow-800"
                                      : "border-green-300 text-green-800"
                                  }
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.id} • {ticket.department} • Requested by {ticket.requestedBy} {ticket.requestedAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "In Progress")
                  .map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>{ticket.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{ticket.title}</h3>
                                <Badge>
                                  {ticket.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    ticket.priority === "High"
                                      ? "border-red-300 text-red-800"
                                      : ticket.priority === "Medium"
                                      ? "border-yellow-300 text-yellow-800"
                                      : "border-green-300 text-green-800"
                                  }
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.id} • {ticket.department} • Requested by {ticket.requestedBy} {ticket.requestedAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "Pending")
                  .map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>{ticket.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{ticket.title}</h3>
                                <Badge variant="secondary">
                                  {ticket.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    ticket.priority === "High"
                                      ? "border-red-300 text-red-800"
                                      : ticket.priority === "Medium"
                                      ? "border-yellow-300 text-yellow-800"
                                      : "border-green-300 text-green-800"
                                  }
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.id} • {ticket.department} • Requested by {ticket.requestedBy} {ticket.requestedAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "Resolved")
                  .map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>{ticket.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{ticket.title}</h3>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 hover:bg-green-100"
                                >
                                  {ticket.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    ticket.priority === "High"
                                      ? "border-red-300 text-red-800"
                                      : ticket.priority === "Medium"
                                      ? "border-yellow-300 text-yellow-800"
                                      : "border-green-300 text-green-800"
                                  }
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.id} • {ticket.department} • Requested by {ticket.requestedBy} {ticket.requestedAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Open</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'Open').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">In Progress</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'In Progress').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'Pending').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resolved</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'Resolved').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
                <CardDescription>Average time to first response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="text-3xl font-bold">2.5 hrs</div>
                    <p className="text-sm text-gray-500">Average time</p>
                  </div>
                </div>
                <div className="pt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>IT Support</span>
                    <span className="font-medium">1.8 hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>HR Department</span>
                    <span className="font-medium">3.2 hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Finance</span>
                    <span className="font-medium">4.0 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frequent Issues</CardTitle>
                <CardDescription>Most common support topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Computer Issues</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Software Access</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Issues</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HR Inquiries</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Other</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
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

export default HelpDesk;
