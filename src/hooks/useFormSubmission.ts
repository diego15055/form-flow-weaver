
import { useCallback } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

export const useFormSubmission = (
  onSubmit: (data: any) => void | Promise<void>,
  setIsSubmitting: (isSubmitting: boolean) => void,
  goToStepWithErrors?: (errors: FieldErrors<FieldValues>) => boolean
) => {
  const { toast } = useToast();

  const cleanFormData = useCallback((data: any) => {
    const cleanedData = { ...data };
    Object.keys(cleanedData).forEach(key => {
      if (key.endsWith('_others') && !cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    return cleanedData;
  }, []);

  const handleSubmit = useCallback(async (data: any, errors?: FieldErrors<FieldValues>) => {
    // Se há função para ir para etapa com erros e existem erros
    if (goToStepWithErrors && errors && Object.keys(errors).length > 0) {
      const movedToErrorStep = goToStepWithErrors(errors);
      if (movedToErrorStep) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const cleanedData = cleanFormData(data);
      await onSubmit(cleanedData);
      
      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulário.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, setIsSubmitting, cleanFormData, toast, goToStepWithErrors]);

  return { handleSubmit };
};
