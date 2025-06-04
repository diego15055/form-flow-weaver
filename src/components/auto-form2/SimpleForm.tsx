import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { AutoFormConfig } from "@/types/auto-form";
import { shouldShowOthersField, getOthersFieldName } from "@/utils/auto-form-utils";
import { FormFieldRenderer } from "./FormFieldRenderer";
import { useFormVisibility } from "@/hooks/useFormVisibility";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { Save } from "lucide-react";

interface SimpleFormProps extends Omit<AutoFormConfig, 'steps' | 'showProgress'> {}

export const SimpleForm = ({ 
  title, 
  description, 
  schema, 
  fields, 
  onSubmit, 
  submitButtonText = "Salvar",
  defaultValues,
  disabled = false
}: SimpleFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues
  });

  const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  const visibleFields = useFormVisibility(fields, watchedValues);
  const { handleSubmit: onFormSubmit } = useFormSubmission(onSubmit, setIsSubmitting);

  // Usando useCallback para evitar recriações desnecessárias da função
  const updateOthersFields = useCallback(() => {
    if (disabled) return;
    
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      const fieldValue = watchedValues[fieldName];
      const othersFieldName = getOthersFieldName(fieldName);
      
      if (shouldShowOthersField(fieldName, fieldValue, fieldConfig)) {
        if (!watchedValues.hasOwnProperty(othersFieldName)) {
          setValue(othersFieldName, '');
        }
      } else if (watchedValues[othersFieldName] !== '') {
        setValue(othersFieldName, '');
      }
    });
  }, [watchedValues, fields, setValue, disabled]);

  useEffect(() => {
    updateOthersFields();
  }, [updateOthersFields]);

  const handleFormSubmit = useCallback((data: any) => {
    onFormSubmit(data, errors);
  }, [onFormSubmit, errors]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormFieldRenderer
              visibleFields={visibleFields}
              fields={fields}
              control={control}
              errors={errors}
              disabled={disabled}
            />
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || disabled}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Salvando..." : submitButtonText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};