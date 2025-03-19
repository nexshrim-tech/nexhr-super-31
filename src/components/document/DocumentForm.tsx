
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DocumentField, DocumentTemplate } from '@/types/documents';

interface DocumentFormProps {
  template: DocumentTemplate;
  onSubmit: (data: any) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ template, onSubmit }) => {
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

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
