
import { useCallback } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { StepConfig } from '@/types/auto-form';

export const useStepValidation = (steps?: StepConfig[]) => {
  const findStepWithErrors = useCallback((errors: FieldErrors<FieldValues>) => {
    if (!steps || !errors) return null;

    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return null;

    // Encontra a primeira etapa que contém campos com erro
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const step = steps[stepIndex];
      const hasErrorInStep = step.fields.some(fieldName => 
        errorFields.includes(fieldName)
      );
      
      if (hasErrorInStep) {
        return stepIndex;
      }
    }

    return null;
  }, [steps]);

  const validateCurrentStep = useCallback((
    currentStep: number,
    errors: FieldErrors<FieldValues>,
    currentStepFields: string[]
  ) => {
    if (!currentStepFields) return true;

    // Verifica se há erros nos campos da etapa atual
    const hasCurrentStepErrors = currentStepFields.some(fieldName => 
      errors[fieldName]
    );

    return !hasCurrentStepErrors;
  }, []);

  return {
    findStepWithErrors,
    validateCurrentStep
  };
};
