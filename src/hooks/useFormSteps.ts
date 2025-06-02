
import { useState, useCallback } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { FormState, StepConfig } from '@/types/auto-form';
import { useStepValidation } from './useStepValidation';

export const useFormSteps = (steps?: StepConfig[]) => {
  const [formState, setFormState] = useState<FormState>({
    currentStep: 0,
    totalSteps: steps ? steps.length : 1,
    isSubmitting: false,
    errors: {}
  });

  const { findStepWithErrors, validateCurrentStep } = useStepValidation(steps);

  const handleNext = useCallback((
    e: React.MouseEvent,
    errors: FieldErrors<FieldValues>,
    trigger: () => Promise<boolean>
  ) => {
    e.preventDefault();
    
    const currentStepFields = getCurrentStepFields();
    
    // Valida apenas os campos da etapa atual
    trigger(currentStepFields).then((isValid) => {
      if (!isValid) {
        // Se há erros na etapa atual, não avança
        return;
      }

      if (formState.currentStep < formState.totalSteps - 1) {
        setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      }
    });
  }, [formState.currentStep, formState.totalSteps]);

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (formState.currentStep > 0) {
      setFormState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [formState.currentStep]);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const getCurrentStepFields = useCallback(() => {
    if (!steps) return undefined;
    return steps[formState.currentStep]?.fields;
  }, [steps, formState.currentStep]);

  const getCurrentStep = useCallback(() => {
    return steps ? steps[formState.currentStep] : null;
  }, [steps, formState.currentStep]);

  const goToStepWithErrors = useCallback((errors: FieldErrors<FieldValues>) => {
    const stepWithErrors = findStepWithErrors(errors);
    if (stepWithErrors !== null && stepWithErrors !== formState.currentStep) {
      setFormState(prev => ({ ...prev, currentStep: stepWithErrors }));
      return true;
    }
    return false;
  }, [findStepWithErrors, formState.currentStep]);

  return {
    formState,
    handleNext,
    handlePrevious,
    setIsSubmitting,
    getCurrentStepFields,
    getCurrentStep,
    goToStepWithErrors,
    isLastStep: formState.currentStep === formState.totalSteps - 1,
    isFirstStep: formState.currentStep === 0
  };
};
