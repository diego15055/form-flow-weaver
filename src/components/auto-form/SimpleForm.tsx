
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AutoFormConfig } from "@/types/auto-form";
import { shouldShowField, shouldShowOthersField, getOthersFieldName } from "@/utils/auto-form-utils";
import { DynamicFormField } from "./FormField";
import { Save } from "lucide-react";

interface SimpleFormProps extends Omit<AutoFormConfig, 'steps' | 'showProgress'> {
  // Remove steps e showProgress do SimpleForm
}

export const SimpleForm = ({ 
  title, 
  description, 
  schema, 
  fields, 
  onSubmit, 
  submitButtonText = "Salvar"
}: SimpleFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  // Generate others fields dynamically
  React.useEffect(() => {
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

  const getVisibleFields = () => {
    const allFields = Object.keys(fields);
    const visibleFields: string[] = [];
    
    allFields.forEach(fieldName => {
      const fieldConfig = fields[fieldName];
      if (shouldShowField(fieldName, fieldConfig, watchedValues)) {
        visibleFields.push(fieldName);
        
        // Add others field if needed
        const othersFieldName = getOthersFieldName(fieldName);
        if (shouldShowOthersField(fieldName, watchedValues[fieldName], fieldConfig)) {
          visibleFields.push(othersFieldName);
        }
      }
    });
    
    return visibleFields;
  };

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Remove empty others fields from final data
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
      setIsSubmitting(false);
    }
  };

  const visibleFields = getVisibleFields();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {visibleFields.map((fieldName) => {
                // Handle others fields
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
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
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
