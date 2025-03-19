
import { ReactNode } from 'react';

export interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  templates: DocumentTemplate[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  fields: DocumentField[];
  category?: string;
}

export interface GeneratedDocument {
  content: string;
  type: string;
}
