
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFormSubmission = (
  onSubmit: (data: any) => void | Promise<void>,
  setIsSubmitting: (isSubmitting: boolean) => void
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

  const handleSubmit = useCallback(async (data: any) => {
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
  }, [onSubmit, setIsSubmitting, cleanFormData, toast]);

  return { handleSubmit };
};
