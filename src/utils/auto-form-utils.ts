
import { z } from "zod";
import { FieldConfig } from "@/types/auto-form";

export const getFieldType = (zodField: any): string => {
  if (zodField instanceof z.ZodString) {
    return 'text';
  }
  if (zodField instanceof z.ZodNumber) {
    return 'number';
  }
  if (zodField instanceof z.ZodBoolean) {
    return 'checkbox';
  }
  if (zodField instanceof z.ZodEnum) {
    return 'select';
  }
  if (zodField instanceof z.ZodDate) {
    return 'date';
  }
  return 'text';
};

export const shouldShowField = (
  fieldName: string,
  fieldConfig: FieldConfig,
  formValues: Record<string, any>
): boolean => {
  if (fieldConfig.hidden) return false;
  
  if (!fieldConfig.dependsOn) return true;
  
  const { field, value, condition = 'equals' } = fieldConfig.dependsOn;
  const fieldValue = formValues[field];
  
  switch (condition) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'includes':
      return Array.isArray(fieldValue) ? fieldValue.includes(value) : fieldValue === value;
    case 'not_includes':
      return Array.isArray(fieldValue) ? !fieldValue.includes(value) : fieldValue !== value;
    default:
      return true;
  }
};

export const shouldShowOthersField = (
  fieldName: string,
  fieldValue: any,
  fieldConfig: FieldConfig
): boolean => {
  if (fieldConfig.type === 'checkbox' && fieldValue === true) {
    return true;
  }
  if (fieldConfig.type === 'radio' && fieldValue === true) {
    return true;
  }
  if (fieldConfig.type === 'select' && fieldValue === 'outros') {
    return true;
  }
  return false;
};

export const getOthersFieldName = (fieldName: string): string => {
  return `${fieldName}_others`;
};
