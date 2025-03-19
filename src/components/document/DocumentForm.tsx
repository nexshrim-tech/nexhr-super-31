
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DocumentField, DocumentTemplate, Employee } from '@/types/documents';
import { User, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentFormProps {
  template: DocumentTemplate;
  onSubmit: (data: any) => void;
}

// Sample employee data for auto-filling
const employees: Employee[] = [
  { 
    id: "EMP001", 
    name: "Olivia Rhye", 
    email: "olivia.rhye@example.com",
    role: "UI Designer",
    department: "Design",
    joiningDate: "2022-01-10",
    reportingManager: "Phoenix Baker",
    employeeId: "EMP-1001",
    avatar: "OR"
  },
  { 
    id: "EMP002", 
    name: "Phoenix Baker", 
    email: "phoenix.baker@example.com",
    role: "Product Manager",
    department: "Product",
    joiningDate: "2021-05-15",
    reportingManager: "Lana Steiner",
    employeeId: "EMP-1002",
    avatar: "PB"
  },
  { 
    id: "EMP003", 
    name: "Lana Steiner", 
    email: "lana.steiner@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    joiningDate: "2021-09-22",
    reportingManager: "Candice Wu",
    employeeId: "EMP-1003",
    avatar: "LS"
  },
  { 
    id: "EMP004", 
    name: "Demi Wilkinson", 
    email: "demi.wilkinson@example.com",
    role: "Backend Developer",
    department: "Engineering",
    joiningDate: "2022-02-01",
    reportingManager: "Candice Wu",
    employeeId: "EMP-1004",
    avatar: "DW"
  },
  { 
    id: "EMP005", 
    name: "Candice Wu", 
    email: "candice.wu@example.com",
    role: "Engineering Lead",
    department: "Engineering",
    joiningDate: "2020-11-15",
    reportingManager: "CEO",
    employeeId: "EMP-1005",
    avatar: "CW"
  },
];

const DocumentForm: React.FC<DocumentFormProps> = ({ template, onSubmit }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const { toast } = useToast();

  const getValidationSchema = (template: DocumentTemplate) => {
    const schemaFields: Record<string, any> = {};
    
    template.fields.forEach(field => {
      if (field.required) {
        schemaFields[field.id] = z.string().min(1, `${field.label} is required`);
      } else {
        schemaFields[field.id] = z.string().optional();
      }
    });
    
    return z.object(schemaFields);
  };

  const validationSchema = getValidationSchema(template);
  type FormValues = z.infer<typeof validationSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: Object.fromEntries(template.fields.map(field => [field.id, ''])) as any,
  });

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    // Map employee data to form fields using employeeField property
    template.fields.forEach(field => {
      if (field.employeeField) {
        const value = employee[field.employeeField as keyof Employee] as string;
        if (value) {
          form.setValue(field.id as any, value);
        }
      } else if (field.id === 'employeeName' || field.id === 'name') {
        form.setValue(field.id as any, employee.name);
      } else if (field.id === 'employeeId' || field.id === 'id') {
        form.setValue(field.id as any, employee.employeeId);
      } else if (field.id === 'email') {
        form.setValue(field.id as any, employee.email);
      } else if (field.id === 'position' || field.id === 'role' || field.id === 'designation') {
        form.setValue(field.id as any, employee.role);
      } else if (field.id === 'department') {
        form.setValue(field.id as any, employee.department);
      } else if (field.id === 'joiningDate' || field.id === 'startDate') {
        form.setValue(field.id as any, employee.joiningDate);
      } else if (field.id === 'reportingManager' || field.id === 'manager') {
        form.setValue(field.id as any, employee.reportingManager);
      }
    });
    
    toast({
      title: "Employee Selected",
      description: `Form auto-filled with ${employee.name}'s information.`
    });
  };

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Select Employee to Auto-fill
          </h3>
          <Select value={selectedEmployee || ""} onValueChange={handleEmployeeSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id} className="flex items-center">
                  {employee.name} - {employee.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedEmployee && (
            <div className="mt-2 text-xs flex items-center text-green-600">
              <UserCheck className="h-3 w-3 mr-1" />
              Employee data auto-filled
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {template.fields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id as any}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    {field.type === 'textarea' ? (
                      <Textarea
                        {...formField}
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'select' ? (
                      <Select
                        value={formField.value}
                        onValueChange={formField.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        {...formField}
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" className="w-full">Generate Document</Button>
      </form>
    </Form>
  );
};

export default DocumentForm;
