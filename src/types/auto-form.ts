
import { z } from "zod";

export interface FieldConfig {
  label?: string;
  placeholder?: string;
  description?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  options?: Array<{ label: string; value: string | boolean }>;
  hidden?: boolean;
  required?: boolean;
  dependsOn?: {
    field: string;
    value: any;
    condition?: 'equals' | 'not_equals' | 'includes' | 'not_includes';
  };
}

export interface StepConfig {
  title: string;
  description?: string;
  fields: string[];
}

export interface AutoFormConfig {
  title: string;
  description?: string;
  schema: z.ZodSchema;
  fields: Record<string, FieldConfig>;
  steps?: StepConfig[];
  onSubmit: (data: any) => void | Promise<void>;
  submitButtonText?: string;
  showProgress?: boolean;
}

export interface FormState {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
