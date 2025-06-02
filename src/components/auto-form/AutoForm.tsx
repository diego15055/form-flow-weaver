
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AutoFormConfig, FormState } from "@/types/auto-form";
import { shouldShowField, shouldShowOthersField, getOthersFieldName } from "@/utils/auto-form-utils";
import { DynamicFormField } from "./FormField";
import { ProgressIndicator } from "./ProgressIndicator";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

export const AutoForm = ({ 
  title, 
  description, 
  schema, 
  fields, 
  steps, 
  onSubmit, 
  submitButtonText = "Salvar",
  showProgress = true 
}: AutoFormConfig) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>({
    currentStep: 0,
    totalSteps: steps ? steps.length : 1,
    isSubmitting: false,
    errors: {}
  });

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  // Generate others fields dynamically
  useEffect(() => {
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      const fieldValue = watchedValues[fieldName];
      const othersFieldName = getOthersFieldName(fieldName);
      
      if (shouldShowOthersField(fieldName, fieldValue, fieldConfig)) {
        if (!watchedValues.hasOwnProperty(othersFieldName)) {
          setValue(othersFieldName, '');
        }
      } else {
        setValue(othersFieldName, '');
      }
    });
  }, [watchedValues, fields, setValue]);

  const getCurrentStepFields = () => {
    if (!steps) {
      return Object.keys(fields);
    }
    return steps[formState.currentStep]?.fields || [];
  };

  const getVisibleFields = () => {
    const currentFields = getCurrentStepFields();
    const visibleFields: string[] = [];
    
    currentFields.forEach(fieldName => {
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
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formState.currentStep < formState.totalSteps - 1) {
      setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formState.currentStep > 0) {
      setFormState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const onFormSubmit = async (data: any) => {
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const cleanedData = { ...data };
      Object.keys(cleanedData).forEach(key => {
        if (key.endsWith('_others') && !cleanedData[key]) {
          delete cleanedData[key];
        }
      });
      
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
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const visibleFields = getVisibleFields();
  const currentStep = steps ? steps[formState.currentStep] : null;
  const isLastStep = formState.currentStep === formState.totalSteps - 1;
  const isFirstStep = formState.currentStep === 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        
        {steps && showProgress && (
          <ProgressIndicator
            currentStep={formState.currentStep}
            totalSteps={formState.totalSteps}
            stepTitles={steps.map(step => step.title)}
          />
        )}
        
        {currentStep && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{currentStep.title}</h3>
            {currentStep.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentStep.description}
              </p>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {visibleFields.map((fieldName) => {
                if (fieldName.endsWith('_others')) {
                  const originalFieldName = fieldName.replace('_others', '');
                  const originalConfig = fields[originalFieldName];
                  
                  return (
                    <DynamicFormField
                      key={fieldName}
                      name={fieldName}
                      config={{
                        label: `Especifique "${originalConfig.label}"`,
                        placeholder: "Digite aqui...",
                        type: 'text',
                        required: false
                      }}
                      control={control}
                      error={errors[fieldName]?.message as string}
                    />
                  );
                }
                
                const fieldConfig = fields[fieldName];
                if (!fieldConfig) return null;
                
                return (
                  <DynamicFormField
                    key={fieldName}
                    name={fieldName}
                    config={fieldConfig}
                    control={control}
                    error={errors[fieldName]?.message as string}
                  />
                );
              })}
            </div>
            
            {steps && (
              <Separator className="my-6" />
            )}
            
            <div className="flex justify-between items-center pt-4">
              <div>
                {!isFirstStep && steps && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isLastStep && steps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {formState.isSubmitting ? "Salvando..." : submitButtonText}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
