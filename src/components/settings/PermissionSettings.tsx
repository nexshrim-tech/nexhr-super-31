
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const permissions = {
  employees: {
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  attendance: {
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  departments: {
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
  salaries: {
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
  documents: {
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  projects: {
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  settings: {
    view: true,
    edit: false,
  },
};

const initialRoles = [
  { id: 1, name: "Admin", description: "Full access to all resources", permissions: { ...permissions, settings: { view: true, edit: true } } },
  { id: 2, name: "HR Manager", description: "Can manage HR related resources", permissions: { ...permissions } },
  { id: 3, name: "Employee", description: "Limited access to own resources", permissions: { ...permissions, employees: { view: true, create: false, edit: false, delete: false }, attendance: { view: true, create: true, edit: false, delete: false }, departments: { view: true, create: false, edit: false, delete: false }, salaries: { view: false, create: false, edit: false, delete: false }, documents: { view: true, create: false, edit: false, delete: false }, projects: { view: true, create: false, edit: false, delete: false }, settings: { view: false, edit: false } } },
];

const PermissionSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(initialRoles[0]);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: { ...permissions }
  });
  
  const handleRoleChange = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
    }
  };
  
  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    const updatedRole = { ...selectedRole };
    updatedRole.permissions[module][action] = checked;
    setSelectedRole(updatedRole);
    
    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id ? updatedRole : role
    );
    setRoles(updatedRoles);
  };
  
  const handleNewRoleChange = (field: string, value: string) => {
    setNewRole({
      ...newRole,
      [field]: value,
    });
  };
  
  const handleNewRolePermissionChange = (module: string, action: string, checked: boolean) => {
    const updatedPermissions = { ...newRole.permissions };
    updatedPermissions[module][action] = checked;
    setNewRole({
      ...newRole,
      permissions: updatedPermissions,
    });
  };
  
  const handleAddNewRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Role name is required.",
        variant: "destructive",
      });
      return;
    }
    
    const newRoleObject = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
    };
    
    setRoles([...roles, newRoleObject]);
    setNewRole({
      name: "",
      description: "",
      permissions: { ...permissions }
    });
    setNewRoleOpen(false);
    
    toast({
      title: "Role added",
      description: `${newRole.name} role has been added successfully.`,
    });
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Permissions updated",
        description: "Role permissions have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Manage user roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div className="space-y-1 w-full max-w-xs">
              <Label htmlFor="role">Select Role</Label>
              <Select 
                value={selectedRole.id.toString()} 
                onValueChange={(value) => handleRoleChange(parseInt(value))}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={newRoleOpen} onOpenChange={setNewRoleOpen}>
              <DialogTrigger asChild>
                <Button className="self-end">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Add a new role with custom permissions for your users.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input 
                        id="roleName"
                        value={newRole.name}
                        onChange={(e) => handleNewRoleChange('name', e.target.value)}
                        placeholder="Enter role name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="roleDescription">Description</Label>
                      <Input 
                        id="roleDescription"
                        value={newRole.description}
                        onChange={(e) => handleNewRoleChange('description', e.target.value)}
                        placeholder="Enter role description"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Permissions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Module</TableHead>
                          <TableHead className="text-center">View</TableHead>
                          <TableHead className="text-center">Create</TableHead>
                          <TableHead className="text-center">Edit</TableHead>
                          <TableHead className="text-center">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(newRole.permissions).map(([module, actions]) => (
                          <TableRow key={module}>
                            <TableCell className="font-medium capitalize">
                              {module}
                            </TableCell>
                            <TableCell className="text-center">
                              {actions.hasOwnProperty('view') && (
                                <Checkbox 
                                  checked={actions.view} 
                                  onCheckedChange={(checked) => 
                                    handleNewRolePermissionChange(module, 'view', checked === true)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {actions.hasOwnProperty('create') && (
                                <Checkbox 
                                  checked={actions.create} 
                                  onCheckedChange={(checked) => 
                                    handleNewRolePermissionChange(module, 'create', checked === true)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {actions.hasOwnProperty('edit') && (
                                <Checkbox 
                                  checked={actions.edit} 
                                  onCheckedChange={(checked) => 
                                    handleNewRolePermissionChange(module, 'edit', checked === true)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {actions.hasOwnProperty('delete') && (
                                <Checkbox 
                                  checked={actions.delete} 
                                  onCheckedChange={(checked) => 
                                    handleNewRolePermissionChange(module, 'delete', checked === true)
                                  }
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewRoleOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddNewRole}>Add Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="font-medium mb-1">{selectedRole.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedRole.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            Configure permissions for selected role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Create</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(selectedRole.permissions).map(([module, actions]) => (
                <TableRow key={module}>
                  <TableCell className="font-medium capitalize">
                    {module}
                  </TableCell>
                  <TableCell className="text-center">
                    {actions.hasOwnProperty('view') && (
                      <Checkbox 
                        checked={actions.view} 
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'view', checked === true)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {actions.hasOwnProperty('create') && (
                      <Checkbox 
                        checked={actions.create} 
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'create', checked === true)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {actions.hasOwnProperty('edit') && (
                      <Checkbox 
                        checked={actions.edit} 
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'edit', checked === true)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {actions.hasOwnProperty('delete') && (
                      <Checkbox 
                        checked={actions.delete} 
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'delete', checked === true)
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Assignment</CardTitle>
          <CardDescription>
            Assign roles to users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">John Doe</TableCell>
                <TableCell>john.doe@example.com</TableCell>
                <TableCell>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Update</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jane Smith</TableCell>
                <TableCell>jane.smith@example.com</TableCell>
                <TableCell>
                  <Select defaultValue="2">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Update</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Robert Johnson</TableCell>
                <TableCell>robert.johnson@example.com</TableCell>
                <TableCell>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Update</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionSettings;
