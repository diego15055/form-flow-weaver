
import { z } from "zod";
import { FieldConfig, FieldDependency } from "@/types/auto-form";

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

const evaluateDependency = (
  dependency: FieldDependency,
  formValues: Record<string, any>
): boolean => {
  const { field, value, condition = 'equals' } = dependency;
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

export const shouldShowField = (
  fieldName: string,
  fieldConfig: FieldConfig,
  formValues: Record<string, any>
): boolean => {
  if (fieldConfig.hidden) return false;
  
  if (!fieldConfig.dependsOn) return true;
  
  // Handle single dependency
  if (!Array.isArray(fieldConfig.dependsOn)) {
    return evaluateDependency(fieldConfig.dependsOn, formValues);
  }
  
  // Handle multiple dependencies (all must be true - AND logic)
  return fieldConfig.dependsOn.every(dependency => 
    evaluateDependency(dependency, formValues)
  );
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
