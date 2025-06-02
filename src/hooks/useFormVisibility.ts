
import { useMemo } from 'react';
import { FieldConfig } from '@/types/auto-form';
import { shouldShowField, shouldShowOthersField, getOthersFieldName } from '@/utils/auto-form-utils';

export const useFormVisibility = (
  fields: Record<string, FieldConfig>,
  watchedValues: Record<string, any>,
  currentStepFields?: string[]
) => {
  return useMemo(() => {
    const fieldsToCheck = currentStepFields || Object.keys(fields);
    const visibleFields: string[] = [];
    
    fieldsToCheck.forEach(fieldName => {
      const fieldConfig = fields[fieldName];
      if (shouldShowField(fieldName, fieldConfig, watchedValues)) {
        visibleFields.push(fieldName);
        
        const othersFieldName = getOthersFieldName(fieldName);
        if (shouldShowOthersField(fieldName, watchedValues[fieldName], fieldConfig)) {
          visibleFields.push(othersFieldName);
        }
      }
    });
    
    return visibleFields;
  }, [fields, watchedValues, currentStepFields]);
};
