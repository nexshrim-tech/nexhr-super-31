
import { ReactNode } from 'react';

export interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  fields: DocumentField[];
}

export interface GeneratedDocument {
  content: string;
  type: string;
}
