
import { useState, useCallback } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { FormState, StepConfig, FieldConfig } from '@/types/auto-form';
import { useStepValidation } from './useStepValidation';
import { shouldShowField } from '@/utils/auto-form-utils';

export const useFormSteps = (steps?: StepConfig[], fields?: Record<string, FieldConfig>) => {
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
    trigger: () => Promise<boolean>,
    watchedValues: Record<string, any>,
    disabled?: boolean
  ) => {
    e.preventDefault();
    
    // Se o formulário está desabilitado, permite navegação sem validação
    if (disabled) {
      if (formState.currentStep < formState.totalSteps - 1) {
        setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      }
      return;
    }
    
    // Para formulários habilitados, executa a validação
    const currentStepFields = getCurrentStepFields();
    
    if (currentStepFields && fields) {
      // Filtra apenas os campos visíveis da etapa atual
      const visibleFields = currentStepFields.filter(fieldName => 
        shouldShowField(fieldName, fields[fieldName], watchedValues)
      );
      
      // Se não há campos visíveis, permite navegação
      if (visibleFields.length === 0) {
        if (formState.currentStep < formState.totalSteps - 1) {
          setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
        }
        return;
      }
      
      // Valida apenas os campos visíveis da etapa atual
      trigger().then((isValid) => {
        if (isValid && formState.currentStep < formState.totalSteps - 1) {
          setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
        }
      });
    } else {
      // Fallback para quando não há campos específicos da etapa
      trigger().then((isValid) => {
        if (isValid && formState.currentStep < formState.totalSteps - 1) {
          setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
        }
      });
    }
  }, [formState.currentStep, formState.totalSteps, fields]);

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
