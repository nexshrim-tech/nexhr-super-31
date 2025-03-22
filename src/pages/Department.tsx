
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  email: string;
  jobtitle: string;
}

interface Department {
  departmentid: number;
  departmentname: string;
  managerid: number;
  numberofemployees: number;
  annualbudget: number;
  departmentstatus: string;
  customerid: number;
  manager?: string;
}

const Department = () => {
  const { toast } = useToast();
  const { customerData } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    departmentname: '',
    managerid: '',
    numberofemployees: 0,
    annualbudget: 0,
    departmentstatus: 'Active'
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!customerData?.customerid) return;

      try {
        setLoading(true);
        
        // Fetch employees first (for manager selection)
        const { data: employeeData, error: employeeError } = await supabase
          .from('employee')
          .select('employeeid, firstname, lastname, email, jobtitle')
          .eq('customerid', customerData.customerid);
        
        if (employeeError) throw employeeError;
        setEmployees(employeeData || []);
        
        // Fetch departments
        const { data: departmentData, error: departmentError } = await supabase
          .from('department')
          .select('*')
          .eq('customerid', customerData.customerid);
        
        if (departmentError) throw departmentError;
        
        // Map departments to include manager name
        const mappedDepartments = (departmentData || []).map(dept => {
          const manager = employeeData?.find(emp => emp.employeeid === dept.managerid);
          return {
            ...dept,
            manager: manager ? `${manager.firstname} ${manager.lastname}` : 'Not Assigned'
          };
        });
        
        setDepartments(mappedDepartments);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch departments. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [customerData, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      departmentname: '',
      managerid: '',
      numberofemployees: 0,
      annualbudget: 0,
      departmentstatus: 'Active'
    });
  };

  const handleCreateDepartment = async () => {
    if (!customerData?.customerid) return;
    
    try {
      const newDepartment = {
        departmentname: formData.departmentname,
        managerid: formData.managerid ? parseInt(formData.managerid) : null,
        numberofemployees: formData.numberofemployees,
        annualbudget: formData.annualbudget,
        departmentstatus: formData.departmentstatus,
        customerid: customerData.customerid
      };
      
      const { data, error } = await supabase
        .from('department')
        .insert(newDepartment)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add manager name to the new department
      const manager = employees.find(emp => emp.employeeid === parseInt(formData.managerid));
      const departmentWithManager = {
        ...data,
        manager: manager ? `${manager.firstname} ${manager.lastname}` : 'Not Assigned'
      };
      
      setDepartments(prev => [...prev, departmentWithManager]);
      
      toast({
        title: 'Success',
        description: 'Department created successfully',
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to create department. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditDepartment = async () => {
    if (!selectedDepartment || !customerData?.customerid) return;
    
    try {
      const updatedDepartment = {
        departmentname: formData.departmentname,
        managerid: formData.managerid ? parseInt(formData.managerid) : null,
        numberofemployees: formData.numberofemployees,
        annualbudget: formData.annualbudget,
        departmentstatus: formData.departmentstatus,
      };
      
      const { data, error } = await supabase
        .from('department')
        .update(updatedDepartment)
        .eq('departmentid', selectedDepartment.departmentid)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add manager name to the updated department
      const manager = employees.find(emp => emp.employeeid === parseInt(formData.managerid));
      const departmentWithManager = {
        ...data,
        manager: manager ? `${manager.firstname} ${manager.lastname}` : 'Not Assigned'
      };
      
      setDepartments(prev => 
        prev.map(dept => 
          dept.departmentid === selectedDepartment.departmentid ? departmentWithManager : dept
        )
      );
      
      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to update department. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    
    try {
      const { error } = await supabase
        .from('department')
        .delete()
        .eq('departmentid', selectedDepartment.departmentid);
      
      if (error) throw error;
      
      setDepartments(prev => 
        prev.filter(dept => dept.departmentid !== selectedDepartment.departmentid)
      );
      
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      departmentname: department.departmentname,
      managerid: department.managerid ? department.managerid.toString() : '',
      numberofemployees: department.numberofemployees,
      annualbudget: department.annualbudget,
      departmentstatus: department.departmentstatus
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.filter(d => d.departmentstatus === 'Active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.reduce((sum, dept) => sum + dept.numberofemployees, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading departments...</div>
          ) : departments.length === 0 ? (
            <div className="text-center py-4">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No departments found. Create your first department.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.departmentid}>
                    <TableCell className="font-medium">{department.departmentname}</TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell>{department.numberofemployees}</TableCell>
                    <TableCell>${department.annualbudget.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        department.departmentstatus === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {department.departmentstatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(department)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(department)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Department Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departmentname" className="text-right">
                Department Name
              </Label>
              <Input
                id="departmentname"
                name="departmentname"
                value={formData.departmentname}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager" className="text-right">
                Manager
              </Label>
              <Select 
                value={formData.managerid} 
                onValueChange={(value) => handleSelectChange('managerid', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.employeeid} value={employee.employeeid.toString()}>
                      {employee.firstname} {employee.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberofemployees" className="text-right">
                No. of Employees
              </Label>
              <Input
                id="numberofemployees"
                name="numberofemployees"
                type="number"
                value={formData.numberofemployees}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="annualbudget" className="text-right">
                Annual Budget ($)
              </Label>
              <Input
                id="annualbudget"
                name="annualbudget"
                type="number"
                value={formData.annualbudget}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.departmentstatus} 
                onValueChange={(value) => handleSelectChange('departmentstatus', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment}>Create Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-departmentname" className="text-right">
                Department Name
              </Label>
              <Input
                id="edit-departmentname"
                name="departmentname"
                value={formData.departmentname}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-manager" className="text-right">
                Manager
              </Label>
              <Select 
                value={formData.managerid} 
                onValueChange={(value) => handleSelectChange('managerid', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.employeeid} value={employee.employeeid.toString()}>
                      {employee.firstname} {employee.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-numberofemployees" className="text-right">
                No. of Employees
              </Label>
              <Input
                id="edit-numberofemployees"
                name="numberofemployees"
                type="number"
                value={formData.numberofemployees}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-annualbudget" className="text-right">
                Annual Budget ($)
              </Label>
              <Input
                id="edit-annualbudget"
                name="annualbudget"
                type="number"
                value={formData.annualbudget}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.departmentstatus} 
                onValueChange={(value) => handleSelectChange('departmentstatus', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete the department 
            <span className="font-bold mx-1">{selectedDepartment?.departmentname}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Department;
