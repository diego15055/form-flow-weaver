
import { useState, useCallback } from 'react';
import { FormState, StepConfig } from '@/types/auto-form';

export const useFormSteps = (steps?: StepConfig[]) => {
  const [formState, setFormState] = useState<FormState>({
    currentStep: 0,
    totalSteps: steps ? steps.length : 1,
    isSubmitting: false,
    errors: {}
  });

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (formState.currentStep < formState.totalSteps - 1) {
      setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
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

  return {
    formState,
    handleNext,
    handlePrevious,
    setIsSubmitting,
    getCurrentStepFields,
    getCurrentStep,
    isLastStep: formState.currentStep === formState.totalSteps - 1,
    isFirstStep: formState.currentStep === 0
  };
};
