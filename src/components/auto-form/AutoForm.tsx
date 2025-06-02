
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { AutoFormConfig } from "@/types/auto-form";
import { shouldShowOthersField, getOthersFieldName } from "@/utils/auto-form-utils";
import { ProgressIndicator } from "./ProgressIndicator";
import { FormNavigation } from "./FormNavigation";
import { FormFieldRenderer } from "./FormFieldRenderer";
import { useFormSteps } from "@/hooks/useFormSteps";
import { useFormVisibility } from "@/hooks/useFormVisibility";
import { useFormSubmission } from "@/hooks/useFormSubmission";

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
  const {
    formState,
    handleNext,
    handlePrevious,
    setIsSubmitting,
    getCurrentStepFields,
    getCurrentStep,
    isLastStep,
    isFirstStep
  } = useFormSteps(steps);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  const currentStepFields = getCurrentStepFields();
  const visibleFields = useFormVisibility(fields, watchedValues, currentStepFields);
  const { handleSubmit: onFormSubmit } = useFormSubmission(onSubmit, setIsSubmitting);

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

  const currentStep = getCurrentStep();

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
            <FormFieldRenderer
              visibleFields={visibleFields}
              fields={fields}
              control={control}
              errors={errors}
            />
            
            {steps && <Separator className="my-6" />}
            
            <FormNavigation
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isSubmitting={formState.isSubmitting}
              hasSteps={!!steps}
              submitButtonText={submitButtonText}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
