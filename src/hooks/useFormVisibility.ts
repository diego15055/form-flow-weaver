
import { useMemo, useRef } from 'react';
import { FieldConfig } from '@/types/auto-form';
import { shouldShowField, shouldShowOthersField, getOthersFieldName } from '@/utils/auto-form-utils';

export const useFormVisibility = (
  fields: Record<string, FieldConfig>,
  watchedValues: Record<string, any>,
  currentStepFields?: string[]
) => {
  // Usar uma referência para comparar valores anteriores
  const prevValuesRef = useRef<{
    fields: Record<string, FieldConfig>;
    watchedValues: Record<string, any>;
    currentStepFields?: string[];
  }>({ fields, watchedValues, currentStepFields });
  
  // Usar useMemo para calcular campos visíveis apenas quando necessário
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
    
    // Atualizar a referência
    prevValuesRef.current = { fields, watchedValues, currentStepFields };
    
    return visibleFields;
  }, [fields, watchedValues, currentStepFields]);
};
