
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const assetData = [
  {
    id: 1,
    name: "MacBook Pro M1",
    type: "Laptop",
    serialNumber: "MBP2021001",
    purchaseDate: "2021-06-15",
    value: 1999.99,
    assignedTo: { name: "Olivia Rhye", avatar: "OR" },
    status: "Assigned",
  },
  {
    id: 2,
    name: "Dell XPS 15",
    type: "Laptop",
    serialNumber: "XPS2022001",
    purchaseDate: "2022-01-10",
    value: 1599.99,
    assignedTo: { name: "Phoenix Baker", avatar: "PB" },
    status: "Assigned",
  },
  {
    id: 3,
    name: "iPhone 13 Pro",
    type: "Mobile Phone",
    serialNumber: "IP13P2021001",
    purchaseDate: "2021-09-25",
    value: 999.99,
    assignedTo: { name: "Lana Steiner", avatar: "LS" },
    status: "Assigned",
  },
  {
    id: 4,
    name: "Samsung Galaxy S22",
    type: "Mobile Phone",
    serialNumber: "SGS22001",
    purchaseDate: "2022-02-15",
    value: 899.99,
    assignedTo: null,
    status: "Available",
  },
  {
    id: 5,
    name: "LG Ultrawide Monitor 34\"",
    type: "Monitor",
    serialNumber: "LGM34001",
    purchaseDate: "2021-11-20",
    value: 699.99,
    assignedTo: { name: "Demi Wilkinson", avatar: "DW" },
    status: "Assigned",
  },
  {
    id: 6,
    name: "Logitech MX Master 3",
    type: "Mouse",
    serialNumber: "LMX3001",
    purchaseDate: "2021-08-05",
    value: 99.99,
    assignedTo: { name: "Candice Wu", avatar: "CW" },
    status: "Assigned",
  },
  {
    id: 7,
    name: "HP Color LaserJet Pro",
    type: "Printer",
    serialNumber: "HPLJP001",
    purchaseDate: "2022-03-10",
    value: 399.99,
    assignedTo: null,
    status: "In Maintenance",
  },
];

const Assets = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Asset Management</h1>
              <p className="text-gray-500">Track and manage company assets</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">126</div>
                <p className="text-sm text-gray-500">$75,450 value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Assigned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">98</div>
                <p className="text-sm text-gray-500">78% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">20</div>
                <p className="text-sm text-gray-500">16% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">8</div>
                <p className="text-sm text-gray-500">6% of total</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Asset Inventory</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search assets..."
                    className="pl-8 w-[250px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetData.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.serialNumber}</TableCell>
                        <TableCell>{asset.purchaseDate}</TableCell>
                        <TableCell>${asset.value.toFixed(2)}</TableCell>
                        <TableCell>
                          {asset.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="" alt={asset.assignedTo.name} />
                                <AvatarFallback>{asset.assignedTo.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{asset.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              asset.status === "Assigned"
                                ? "bg-blue-100 text-blue-800"
                                : asset.status === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {asset.status}
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
        </div>
      </div>
    </div>
  );
};

export default Assets;
